import { query } from '../db.js';

export const getCart = async (req, res) => {
  try {
    const result = await query(
      `SELECT c.*, row_to_json(p.*) as product 
       FROM cart_items c 
       LEFT JOIN products p ON c.productid = p.id 
       WHERE c.userid = $1`,
      [req.user.id]
    );
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const existing = await query(
      `SELECT * FROM cart_items WHERE userid = $1 AND productid = $2`,
      [req.user.id, productId]
    );
    const existingItem = existing.rows[0];

    if (existingItem) {
      const updated = await query(
        `UPDATE cart_items SET quantity = $1 WHERE id = $2 RETURNING *`,
        [existingItem.quantity + (quantity || 1), existingItem.id]
      );
      return res.status(200).json({ success: true, data: updated.rows[0] });
    }

    const newItem = await query(
      `INSERT INTO cart_items (userid, productid, quantity) VALUES ($1, $2, $3) RETURNING *`,
      [req.user.id, productId, quantity || 1]
    );
    res.status(201).json({ success: true, data: newItem.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { quantity, isSelected } = req.body;
    const { id } = req.params;
    
    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (quantity !== undefined) {
      updates.push(`quantity = $${paramIndex++}`);
      values.push(quantity);
    }
    if (isSelected !== undefined) {
      updates.push(`isselected = $${paramIndex++}`);
      values.push(isSelected);
    }

    values.push(parseInt(id));
    const queryStr = `UPDATE cart_items SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
    
    const updated = await query(queryStr, values);
    res.status(200).json({ success: true, data: updated.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    await query(`DELETE FROM cart_items WHERE id = $1`, [parseInt(id)]);
    res.status(200).json({ success: true, message: 'Item removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    await query(`DELETE FROM cart_items WHERE userid = $1`, [req.user.id]);
    res.status(200).json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
