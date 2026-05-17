import { query } from '../db.js';

export const getAddresses = async (req, res) => {
  try {
    const result = await query(
      `SELECT * FROM addresses WHERE userid = $1 ORDER BY createdat DESC`,
      [req.user.id]
    );
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addAddress = async (req, res) => {
  try {
    const { full_name, phone, address_line_1, address_line_2, landmark, city, state, pincode, address_type, is_default } = req.body;
    
    if (is_default) {
      await query(
        `UPDATE addresses SET is_default = false WHERE userid = $1`,
        [req.user.id]
      );
    }

    const result = await query(
      `INSERT INTO addresses (userid, full_name, phone, address_line_1, address_line_2, landmark, city, state, pincode, address_type, is_default)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [req.user.id, full_name, phone, address_line_1, address_line_2, landmark, city, state, pincode, address_type, is_default]
    );
    
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, phone, address_line_1, address_line_2, landmark, city, state, pincode, address_type, is_default } = req.body;
    
    if (is_default) {
      await query(
        `UPDATE addresses SET is_default = false WHERE userid = $1`,
        [req.user.id]
      );
    }

    const result = await query(
      `UPDATE addresses SET 
        full_name = $1, phone = $2, address_line_1 = $3, address_line_2 = $4, landmark = $5, 
        city = $6, state = $7, pincode = $8, address_type = $9, is_default = $10 
       WHERE id = $11 RETURNING *`,
      [full_name, phone, address_line_1, address_line_2, landmark, city, state, pincode, address_type, is_default, parseInt(id)]
    );
    
    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    await query(`DELETE FROM addresses WHERE id = $1`, [parseInt(id)]);
    res.status(200).json({ success: true, message: 'Address deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const setDefaultAddress = async (req, res) => {
  try {
    const { id } = req.params;
    
    await query(
      `UPDATE addresses SET is_default = false WHERE userid = $1`,
      [req.user.id]
    );

    const result = await query(
      `UPDATE addresses SET is_default = true WHERE id = $1 RETURNING *`,
      [parseInt(id)]
    );
    
    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
