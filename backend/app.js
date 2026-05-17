import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import userroutes from "./routes/userroutes.js";
import productroutes from "./routes/productroutes/productroutes.js";
import cartroutes from "./routes/cartroutes.js";
import orderroutes from "./routes/orderroutes.js";
import addressroutes from "./routes/addressroutes.js";
import adminRoutes from "./routes/adminRoutes.js";


const app = express();

dotenv.config();

const PORT = process.env.PORT || 5000;

/* Middleware */

app.use(express.json());

app.use(cors({
  origin: ["http://localhost:5174", "http://localhost:5173"],
  credentials: true
}));

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

/* Routes */

app.get("/", (req, res) => {
  res.send("Server is live");
});

app.use("/api/users", userroutes);
app.use("/api/products", productroutes);
app.use("/api/cart", cartroutes);
app.use("/api/orders", orderroutes);
app.use("/api/user/addresses", addressroutes);
app.use("/api/admin", adminRoutes);


/* Server */

app.listen(PORT, () => {
  console.log(`Server is Live at port ${PORT}`);
});