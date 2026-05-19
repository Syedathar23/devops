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

    // Fetch a user ID to link the product creator
    const userRes = await client.query("SELECT id FROM users LIMIT 1");
    if (userRes.rows.length === 0) {
      console.error("No users found in database. Please sign up an account first.");
      await client.end();
      return;
    }
    const userId = userRes.rows[0].id;
    console.log(`Linking product to User ID: ${userId}`);

    // Insert high-quality gym product
    const query = `
      INSERT INTO products (
        title, description, description2, description3, descriptionhero,
        adcopyfb1, adcopyfb2, adcopy1, adcopy2, adcopy3,
        free, priceofgoods, sellprice, aliexpresslink, cjdropshippinglink,
        competitorshop, productage, popularity, competitiveness, bestplatform,
        category, keywords,
        image1, image2, image3, image4, image5, image6, image7, image8,
        userid, badge, createdat, updatedat
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, NOW(), NOW()
      ) RETURNING *;
    `;

    const values = [
      "FitZone Pro Whey Protein", // title
      "Premium quality whey protein with 25g pure isolate per serving. Promotes muscle recovery and growth.", // description
      "Flavored with rich Belgian Chocolate cocoa. Dissolves easily in water.", // description2
      "100% organic and third-party lab tested.", // description3
      "Elite Muscle Recovery & Hydration Pack", // descriptionhero
      "Get the best protein on the market for 15% off!", // adcopyfb1
      "Train harder, recover faster.", // adcopyfb2
      "Elite protein source", // adcopy1
      "Third party tested", // adcopy2
      "Belgian Chocolate", // adcopy3
      false, // free
      2500, // priceofgoods (costprice)
      4500, // sellprice (4500 rupees)
      "https://aliexpress.com", // aliexpresslink
      "https://cjdropshipping.com", // cjdropshippinglink
      "https://competitor.com", // competitorshop
      1, // productage
      90, // popularity
      50, // competitiveness
      "Facebook", // bestplatform
      "Supplements", // category
      ["whey", "protein", "supplements", "gym", "workout"], // keywords
      "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?q=80&w=800&auto=format&fit=crop", // image1
      "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=800&auto=format&fit=crop", // image2
      "", "", "", "", "", "", // other images
      userId, // userid
      "New Arrival" // badge
    ];

    const res = await client.query(query, values);
    console.log("Successfully seeded sample product:", res.rows[0]);

  } catch (error) {
    console.error("Database seed failed:", error);
  } finally {
    await client.end();
  }
}

run();
