import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function run() {
  try {
    await client.connect();
    console.log("Connected to database successfully!");

    // Alter products table to add gender column
    await client.query(`
      ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS gender VARCHAR(50) DEFAULT 'unisex';
    `);
    console.log("Successfully added 'gender' column to products table!");

    // Update existing sample products to match their logical gender
    await client.query(`
      UPDATE products 
      SET gender = 'men' 
      WHERE LOWER(title) LIKE '%men%' AND LOWER(title) NOT LIKE '%women%';
    `);
    await client.query(`
      UPDATE products 
      SET gender = 'women' 
      WHERE LOWER(title) LIKE '%women%';
    `);
    console.log("Updated gender column of existing products based on title search.");

  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await client.end();
  }
}

run();
