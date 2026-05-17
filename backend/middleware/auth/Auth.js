import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { query } from "../../db.js";

export const userAuth = asyncHandler(async (req, res, next) => {
  let token;

  //  Get token
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No entry without authentication",
    });
  }

  try {
    //  Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    //  Find user
    const userResult = await query(`SELECT * FROM users WHERE id = $1`, [decoded.id]);
    const userFound = userResult.rows[0];

    if (!userFound) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }
    // remove password
    const { password, ...userWithoutPassword } = userFound;

    // Attach user
    req.user = userFound;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Error at Authentication",
      error: error.message,
    });
  }
});
