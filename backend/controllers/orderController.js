import { pool, query } from '../db.js';
import { estimateDeliveryTime } from '../utils/deliveryEstimator.js';

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
