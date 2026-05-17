import asyncHandler from "express-async-handler";
import { query } from "../../db.js"; 

export const createProduct = asyncHandler(async(req,res)=>{
  const {
    title, description, description2, description3, descriptionHero,
    adcopyFb1, adcopyFb2, adcopy1, adcopy2, adcopy3,
    free, priceOfGoods, sellPrice, aliexpressLink, cjdropshippingLink,
    competitorShop, productAge, popularity, competitiveness, bestPlatform,
    category, keywords
  } = req.body;
  
  try {
    const creativeGot = [];
    const imagesGot = [];
    req.images.map((creative)=>{
      if(creative.endsWith(".mov")||creative.endsWith(".mp4")){
        creativeGot.push(creative);
      }
    })
    req.images.map((image)=>{
      if(image.endsWith(".jpg")||image.endsWith(".png") || image.endsWith(".jpeg")){
        imagesGot.push(image);
      }
    })

    const result = await query(
      `INSERT INTO products (
        title, description, description2, description3, descriptionhero,
        adcopyfb1, adcopyfb2, adcopy1, adcopy2, adcopy3,
        creative1, creative2,
        free, priceofgoods, sellprice, aliexpresslink, cjdropshippinglink,
        competitorshop, productage, popularity, competitiveness, bestplatform,
        category, keywords,
        image1, image2, image3, image4, image5, image6, image7, image8,
        userid, createdat, updatedat
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, NOW(), NOW()
      ) RETURNING *`,
      [
        title, description, description2, description3, descriptionHero,
        adcopyFb1, adcopyFb2, adcopy1, adcopy2, adcopy3,
        creativeGot[0], creativeGot[1],
        free, priceOfGoods, sellPrice, aliexpressLink, cjdropshippingLink,
        competitorShop, productAge, popularity, competitiveness, bestPlatform,
        category, keywords,
        imagesGot[0], imagesGot[1], imagesGot[2], imagesGot[3], imagesGot[4], imagesGot[5], imagesGot[6], imagesGot[7],
        req.user.id
      ]
    );

    res.status(200).json(result.rows[0]);
    
  } catch (error) {
     return res.status(403).json({
    success: false,
    message: error.message,
    });
  }
});

export const fetchAllProducts = asyncHandler(async (req, res) => {
  const result = await query(
    `SELECT p.*, row_to_json(u.*) as user 
     FROM products p 
     LEFT JOIN users u ON p.userid = u.id 
     ORDER BY p.createdat DESC`
  );
  res.status(200).json(result.rows);
});

export const fetchFreeproducts = asyncHandler(async(req,res)=>{
  try {
    const result = await query(
      `SELECT p.*, row_to_json(u.*) as user 
       FROM products p 
       LEFT JOIN users u ON p.userid = u.id 
       WHERE p.free = true 
       ORDER BY p.createdat DESC`
    );
    res.status(200).json(result.rows);
  } catch (error) {
    return res.status(403).json({
    success: false,
    message: error.message,
    });
  }
});

export const fetchPaidProd = asyncHandler(async (req, res) => {
  const result = await query(
    `SELECT p.*, row_to_json(u.*) as user 
     FROM products p 
     LEFT JOIN users u ON p.userid = u.id 
     WHERE p.free = false 
     ORDER BY p.createdat DESC`
  );
  res.status(200).json(result.rows);
});

export const fetchTiktokProd = asyncHandler(async (req, res) => {
  const result = await query(
    `SELECT p.*, row_to_json(u.*) as user 
     FROM products p 
     LEFT JOIN users u ON p.userid = u.id 
     WHERE p.free = false AND p.bestplatform = 'Tiktok'
     ORDER BY p.createdat DESC`
  );
  res.status(200).json(result.rows);
});

export const fetchGoogleProd = asyncHandler(async (req, res) => {
  const result = await query(
    `SELECT p.*, row_to_json(u.*) as user 
     FROM products p 
     LEFT JOIN users u ON p.userid = u.id 
     WHERE p.free = false AND p.bestplatform = 'Google'
     ORDER BY p.createdat DESC`
  );
  res.status(200).json(result.rows);
});

export const fetchFacebookProd = asyncHandler(async (req, res) => {
  const result = await query(
    `SELECT p.*, row_to_json(u.*) as user 
     FROM products p 
     LEFT JOIN users u ON p.userid = u.id 
     WHERE p.free = false AND p.bestplatform = 'Facebook'
     ORDER BY p.createdat DESC`
  );
  res.status(200).json(result.rows);
});

export const fetchSingleProd = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await query(
    `SELECT p.*, row_to_json(u.*) as user 
     FROM products p 
     LEFT JOIN users u ON p.userid = u.id 
     WHERE p.id = $1`,
    [id]
  );
  res.status(200).json(result.rows[0]);
});

export const fetchSingleProdFree = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await query(
    `SELECT p.*, row_to_json(u.*) as user 
     FROM products p 
     LEFT JOIN users u ON p.userid = u.id 
     WHERE p.id = $1 AND p.free = true`,
    [id]
  );
  res.status(200).json(result.rows[0]);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  const fields = Object.keys(req.body).filter(key => key !== 'id');
  const values = fields.map(key => req.body[key]);
  values.push(user?.id);
  values.push(id);
  
  const setClause = fields.map((field, index) => `"${field.toLowerCase()}" = $${index + 1}`).join(', ');
  const queryStr = `UPDATE products SET ${setClause}, userid = $${fields.length + 1}, updatedat = NOW() WHERE id = $${fields.length + 2} RETURNING *`;

  const result = await query(queryStr, values);
  
  // Fetch with user info
  const finalResult = await query(
    `SELECT p.*, row_to_json(u.*) as user 
     FROM products p 
     LEFT JOIN users u ON p.userid = u.id 
     WHERE p.id = $1`,
    [id]
  );

  res.status(200).json(finalResult.rows[0]);
});

export const deleteProductSingle = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await query(`DELETE FROM products WHERE id = $1 RETURNING *`, [id]);
  res.status(200).json(result.rows[0]);
});

export const deleteAllProducts = asyncHandler(async (req, res) => {
  const result = await query(`DELETE FROM products`);
  res.status(200).json({ count: result.rowCount });
});