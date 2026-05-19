import { pool, query } from '../db.js';
import { estimateDeliveryTime } from '../utils/deliveryEstimator.js';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export const createOrder = async (req, res) => {
  const client = await pool.connect();
  try {
    const { items, totalAmount, addressId, paymentMethod, paymentStatus } = req.body; 
    
    // Fetch address details for delivery estimation
    const addressRes = await client.query('SELECT * FROM addresses WHERE id = $1', [addressId]);
    const address = addressRes.rows[0];
    
    const estimatedDelivery = estimateDeliveryTime(address?.state, address?.city);

    await client.query('BEGIN');
    
    const orderRes = await client.query(
      `INSERT INTO orders (userid, totalamount, status, addressid, paymentmethod, paymentstatus, estimated_delivery, createdat, updatedat) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW()) RETURNING *`,
      [req.user.id, totalAmount, "Processing", addressId, paymentMethod || 'Card', paymentStatus || 'Pending', estimatedDelivery]
    );
    const order = orderRes.rows[0];

    const orderItems = [];
    console.log('Items received:', JSON.stringify(items, null, 2));
    
    for (const item of items) {
      console.log('Processing item:', item);
      const productId = item.productId || item.id;
      
      if (!productId) {
        console.error('Missing Product ID for item:', item);
        throw new Error(`Product ID is missing for item: ${item.name || 'Unknown'}`);
      }

      const itemRes = await client.query(
        `INSERT INTO order_items (orderid, productid, quantity, price) 
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [order.id, parseInt(productId), item.quantity, item.price]
      );
      
      orderItems.push(itemRes.rows[0]);
    }
    order.items = orderItems;
    
    // Clear selected items from cart after checkout
    await client.query(
      `DELETE FROM cart_items WHERE userid = $1 AND isselected = true`,
      [req.user.id]
    );

    await client.query('COMMIT');
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ success: false, message: error.message });
  } finally {
    client.release();
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const result = await query(
      `SELECT o.*, 
        COALESCE(
          json_agg(
            json_build_object(
              'id', i.id,
              'productId', i.productid,
              'quantity', i.quantity,
              'price', i.price,
              'product', row_to_json(p.*)
            )
          ) FILTER (WHERE i.id IS NOT NULL), '[]'
        ) as items
       FROM orders o
       LEFT JOIN order_items i ON o.id = i.orderid
       LEFT JOIN products p ON i.productid = p.id
       WHERE o.userid = $1
       GROUP BY o.id
       ORDER BY o.createdat DESC`,
      [req.user.id]
    );
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      `SELECT o.*, 
        COALESCE(
          json_agg(
            json_build_object(
              'id', i.id,
              'productId', i.productid,
              'quantity', i.quantity,
              'price', i.price,
              'product', row_to_json(p.*)
            )
          ) FILTER (WHERE i.id IS NOT NULL), '[]'
        ) as items
       FROM orders o
       LEFT JOIN order_items i ON o.id = i.orderid
       LEFT JOIN products p ON i.productid = p.id
       WHERE o.id = $1
       GROUP BY o.id`,
      [parseInt(id)]
    );
    const order = result.rows[0];
    if (!order || order.userid !== req.user.id) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createStripeCheckoutSession = async (req, res) => {
  const client = await pool.connect();
  try {
    const { items, totalAmount, addressId, paymentMethod } = req.body;
    
    // Fetch address details for delivery estimation
    const addressRes = await client.query('SELECT * FROM addresses WHERE id = $1', [addressId]);
    const address = addressRes.rows[0];
    
    const estimatedDelivery = estimateDeliveryTime(address?.state, address?.city);

    await client.query('BEGIN');
    
    // Create the order with 'Pending Payment' status
    const orderRes = await client.query(
      `INSERT INTO orders (userid, totalamount, status, addressid, paymentmethod, paymentstatus, estimated_delivery, createdat, updatedat) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW()) RETURNING *`,
      [req.user.id, totalAmount, "Pending Payment", addressId, paymentMethod || 'Card', 'Pending', estimatedDelivery]
    );
    const order = orderRes.rows[0];

    const orderItems = [];
    for (const item of items) {
      const productId = item.productId || item.id;
      if (!productId) {
        throw new Error(`Product ID is missing for item: ${item.name || 'Unknown'}`);
      }

      const itemRes = await client.query(
        `INSERT INTO order_items (orderid, productid, quantity, price) 
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [order.id, parseInt(productId), item.quantity, item.price]
      );
      orderItems.push(itemRes.rows[0]);
    }
    
    await client.query('COMMIT');

    // Create Stripe Checkout Session
    // We override price to 1 INR (100 paise) as requested by the user
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'upi'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: 'FITZONE Gym Gear (Test Mode)',
              description: `Payment for Order #${order.id}. Real total: $${totalAmount}`,
            },
            unit_amount: 5000, // 5000 paise = 50 INR (Stripe's minimum charge limit to avoid 50 cents validation error)
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/orders?payment=success&session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/checkout?payment=cancelled`,
      metadata: {
        orderId: order.id.toString(),
        userId: req.user.id.toString(),
      },
    });

    res.status(200).json({ success: true, url: session.url, orderId: order.id });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ success: false, message: error.message });
  } finally {
    client.release();
  }
};

export const confirmStripePayment = async (req, res) => {
  const { sessionId, orderId } = req.body;
  
  if (!sessionId || !orderId) {
    return res.status(400).json({ success: false, message: 'Session ID and Order ID are required.' });
  }

  try {
    // Retrieve Stripe checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      // Update order status to Paid in DB
      const result = await query(
        `UPDATE orders 
         SET paymentstatus = 'Paid', status = 'Processing', updatedat = NOW() 
         WHERE id = $1 AND userid = $2 RETURNING *`,
        [parseInt(orderId), req.user.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Order not found or unauthorized.' });
      }

      // Also clear cart items since payment succeeded
      await query(
        `DELETE FROM cart_items WHERE userid = $1 AND isselected = true`,
        [req.user.id]
      );

      return res.status(200).json({ success: true, message: 'Payment confirmed and order completed!', order: result.rows[0] });
    } else {
      return res.status(400).json({ success: false, message: 'Payment has not been completed.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
