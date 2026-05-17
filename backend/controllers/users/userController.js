// controllers/authController.js   ← ESM version

import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { query } from "../../db.js"; 
import Stripe from "stripe";
import dotenv from "dotenv";
import emailService from "../../utils/emailService.js";
import crypto from "crypto";
import { createAccountVerificationToken, createPasswordResetToken } from "../../token/authtoken.js";
import { getVerificationEmailTemplate } from "../../utils/emailTemplates.js";

dotenv.config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Register User – ESM + Prisma + PostgreSQL
export const registerUser = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  // 1. Check if user already exists
  const existingUserResult = await query(
    `SELECT * FROM users WHERE email = $1`,
    [email.toLowerCase()]
  );

  if (existingUserResult.rows.length > 0) {
    return res.status(409).json({
      success: false,
      message: "User already exists! Please login.",
    });
  }

  // 2. Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // 3. Create Stripe customer
  const stripeCustomer = await stripe.customers.create({
    email: email.toLowerCase(),
    name: `${firstName} ${lastName}`,
  });

  // 4. Create user in DB
  const newUserResult = await query(
    `INSERT INTO users (email, password, firstname, lastname, stripe_customer_id, createdat, updatedat) 
     VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING id, email, firstname, lastname, stripe_customer_id, role, isverified, createdat`,
    [email.toLowerCase(), hashedPassword, firstName, lastName, stripeCustomer.id]
  );
  const newUser = newUserResult.rows[0];

  // 5. Generate JWT
  const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "12h",
  });

  // 6. Send response + secure cookie
  res
    .status(201)
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 12 * 60 * 60 * 1000, // 12 hours
    });

  const verificationToken = await createAccountVerificationToken(newUser.id);

  // Send verification email
  const verificationLink = `http://localhost:3000/verify?token=${verificationToken}`;

  const msg = {
    to: newUser.email,
    from: `"LUXE Support" <${process.env.EMAIL_USER}>`,
    subject: 'Verify your LUXE account',
    text: `Hi ${newUser.firstname}, please verify your email address by clicking here: ${verificationLink}`,
    html: getVerificationEmailTemplate(newUser.firstname, verificationLink),
  };

  await emailService.send(msg);

  res.json({
    success: true,
    message: "User registered! Check your email to verify.",
    token,
    user: newUser,
  });
});

export const userLogin = asyncHandler(async (req,res)=>{
  try{
    const { email, password } = req.body;  
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const userResult = await query(
      `SELECT * FROM users WHERE email = $1`,
      [email.toLowerCase()]
    );
  
    if(userResult.rows.length === 0){
      throw new Error("User does not exist! Please sign up ");
    }
  
    const user = userResult.rows[0];
    const comparePass = await bcrypt.compare(password, user.password);
  
    if(!comparePass){
      throw new Error("Password Does not Match!");
    }
  
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn:"12h",
    });
  
    delete user.password;
  
    res.status(200).cookie("token",token,{
      expires: new Date(Date.now()),
      sameSite:"None",
      secure: true, 
      maxAge:12 * 60 * 60 * 1000
    }).json({
      success:true,
      token,
      user
    })
  }catch(Error){
    return res.status(403).json({
    success: false,
    message: Error.message,
    });
  }
})

export const testController = asyncHandler(async(req,res)=>{
  const id = req.user?.id;
  try {
    const result = await query(`SELECT * FROM users WHERE id = $1`, [id]);
    res.status(200)
    .json({
      success:"true",
      user: result.rows[0]
    })
  } catch (error) {
    res.status(401).json({
      success:false,
      message:error.message,
    });
  }
})

export const fetchAllUsers = asyncHandler(async(req,res)=>{
  try {
    const result = await query(`SELECT * FROM users`);
    res
    .status(200)
    .json({
      success:true,
      user: result.rows
    })
  } catch (error) {
    res.status(401).json({
      success:false,
      message:error.message,
    });
  }
});

export const stripePrices = asyncHandler(async(req,res)=>{
  try {
    const prices = await stripe.prices.list();
    const pricesData = prices.data;
    res.status(200).json({
      success:true,
      pricesData,
    })
  } catch (error) {
    res.status(401).json({
      success:false,
      message:error.message,
    });
  }
});

export const updatePassword = asyncHandler(async (req,res) => {
    const {password} = req.body;
    const userId = req.user?.id;
    if(!userId){
      return res.status(401).json({
        success:false,
        message:"User not authenticated",
      });
    }
    try {
      const result = await query(`SELECT password FROM users WHERE id = $1`, [userId]);
      const user = result.rows[0];
      if(!user){
        throw new Error("User not found");
      }
      const comparePassword = await bcrypt.compare(password,user.password);
      if(comparePassword){
        throw new Error("New password cannot be same as old password");
      }else{
        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(password,salt);
        await query(
          `UPDATE users SET password = $1, updatedat = NOW() WHERE id = $2`,
          [encryptedPassword, userId]
        );
        res.status(200).json({
          success:true,
          message:"Password updated successfully"
        });
      }
        
    } catch (error) {
      res.status(401).json({
      success:false,
      message:error.message,
    });
        
  }
});

export const resetpassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  try {
    const result = await query(`SELECT * FROM users WHERE email = $1`, [email.toLowerCase()]);
    const user = result.rows[0];
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User with this email does not exist.",
      });
    }
    // Generate password reset token
    const resetToken = await createPasswordResetToken(user.id); 
    // Send password reset email
    const resetLink = `http://localhost:3000/resetpassword?token=${resetToken}`;
    const msg = {
      to: user.email,
      from: 'syedathar23m@gmail.com',
      subject: 'Reset Your Password for SkillBolt',
      text: `Click here to reset your password: ${resetLink}`,
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    };
    await emailService.send(msg);
    res.status(200).json({
      success: true,
      message: "Password reset email sent. Please check your inbox.",
    });
  } catch (error) {
    res.status(401).json({
      success:false,
      message:error.message,
    });
  }
});

export const userPasswordResetAfterClick = asyncHandler(async (req,res)=>{
  const {token, newpassword} = req.body;
  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const result = await query(
      `SELECT * FROM users WHERE passwordresettoken = $1 AND passwordresetexpires > NOW()`,
      [hashedToken]
    );
    const user = result.rows[0];
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired password reset token.",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(newpassword,salt);
    await query(
      `UPDATE users SET password = $1, passwordresettoken = NULL, passwordresetexpires = NULL, updatedat = NOW() WHERE id = $2`,
      [encryptedPassword, user.id]
    );
    res.status(200).json({ success: true, message: "Password reset successful" });
  } catch (error) {
    res.status(401).json({
      success:false,
      message:error.message,
    });
  }
});

export const verifyAccount = asyncHandler(async (req, res) => {
  const id = req.user.id;
  try{
    const result = await query(`SELECT * FROM users WHERE id = $1`, [id]);
    const user = result.rows[0];
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User with this email does not exist.",
      });
    }
    const verificationToken = await createAccountVerificationToken(user.id);
    const verificationLink = `http://localhost:3000/verify?token=${verificationToken}`;
    const msg = {
      to: user.email,
      from: `"LUXE Support" <${process.env.EMAIL_USER}>`,
      subject: 'Verify your LUXE account',
      text: `Hi ${user.firstname}, please verify your email address by clicking here: ${verificationLink}`,
      html: getVerificationEmailTemplate(user.firstname, verificationLink),
    };
    await emailService.send(msg);
    res.status(200).json({
      success: true,
      message: "Verification email sent. Please check your inbox.",
    });
  }catch (error) {
    res.status(401).json({
      success:false,
      message:error.message,
    });
  }
});

export const verifyAccountAfterClick = asyncHandler(async (req,res)=>{
  const {token} = req.body;
  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const result = await query(
      `SELECT * FROM users WHERE accountverificationtoken = $1 AND accountverificationtokenexpires > NOW()`,
      [hashedToken]
    );
    const user = result.rows[0];
    if (!user) {
      return res.status(400).json({
        success: false, 
        message: "Invalid or expired account verification token.",
      });
    }
    await query(
      `UPDATE users SET isverified = true, accountverificationtoken = NULL, accountverificationtokenexpires = NULL, updatedat = NOW() WHERE id = $1`,
      [user.id]
    );
    res.status(200).json({
      success:true,
      message:"Account verified successfully",
    });
  } catch (error) {
    res.status(401).json({
      success:false,
      message:error.message,
    });
  }
});

export const updateUserField = asyncHandler( async(req,res)=>{
  const id = req.user.id;
  try {
    const fields = Object.keys(req.body);
    const values = Object.values(req.body);
    // Convert field names to lowercase for the query
    const setClause = fields.map((field, index) => `"${field.toLowerCase()}" = $${index + 1}`).join(', ');
    values.push(id);
    const queryStr = `UPDATE users SET ${setClause}, updatedat = NOW() WHERE id = $${fields.length + 1} RETURNING id, firstname, lastname, email, updatedat`;

    const result = await query(queryStr, values);
    const updatedUser = result.rows[0];

    if(!updatedUser) throw new Error("No user Found");

    res.status(200).json({
      success: true,
      data: updatedUser,
    });
    
  } catch (error) {
    res.status(401).json({
      success:false,
      message:error.message,
    });
  }
});

export const saveProduct = asyncHandler(async(req,res)=>{
  const productId = Number(req.body.productId);
  const userId = req.user.id;
  if (!productId) {
    res.status(400);
    throw new Error("Product ID is required");
  }

  const isSavedResult = await query(
    `SELECT * FROM saved_products WHERE userid = $1 AND productid = $2`,
    [userId, productId]
  );
  
  if(isSavedResult.rows.length > 0) throw new Error("Product already saved"); 

  await query(
    `INSERT INTO saved_products (userid, productid, createdat) VALUES ($1, $2, NOW())`,
    [userId, productId]
  );
  
  res.status(200).json({
    success: true,
    message: "Product saved successfully",
  });
});

export const unsaveProducts = asyncHandler(async(req,res)=>{
  const productId = Number(req.body.productId);
  const userId = req.user.id;

  if (!productId) {
    res.status(400);
    throw new Error("Product ID is required");
  }

  const isSavedResult = await query(
    `SELECT * FROM saved_products WHERE userid = $1 AND productid = $2`,
    [userId, productId]
  );

  if (isSavedResult.rows.length === 0) {
    res.status(404);
    throw new Error("Product not found in saved list");
  }

  await query(
    `DELETE FROM saved_products WHERE id = $1`,
    [isSavedResult.rows[0].id]
  );

  res.status(200).json({
    success: true,
    message: "Product unsaved successfully",
  });
});

export const createSubWindow = asyncHandler(async (req, res) => {
  const id = req.user.id; 

  try {
    const result = await query(
      `SELECT id, stripe_customer_id FROM users WHERE id = $1`,
      [id]
    );
    const targetUser = result.rows[0];

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: req.body.priceId,
          quantity: 1,
        },
      ],
      customer: targetUser.stripe_customer_id,
      success_url: process.env.APP_STRIPE_SUCCESS_URL,
      cancel_url: process.env.APP_STRIPE_CANCEL_URL,
    });

    res.status(200).json({
      success: true,
      url: session.url, 
    });

  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
});

export const subStausUpdate =  asyncHandler(async(req,res)=>{
  const id = req.user.id;
  const result = await query(
    `SELECT id, stripe_customer_id FROM users WHERE id = $1`,
    [id]
  );
  const targetUser = result.rows[0];

  if (!targetUser) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const customerid = targetUser.stripe_customer_id;
  if (!customerid) {
    return res.status(400).json({
      success: false,
      message: "Stripe customer ID not found",
    });
  }
  try {
    const substatus = await stripe.subscriptions.list({
      customer: customerid,
      status: "all",
      expand: ["data.default_payment_method"],
    });
    await query(
      `UPDATE users SET subscriptions = $1, role = 'subscriber', updatedat = NOW() WHERE id = $2`,
      [JSON.stringify(substatus.data), id]
    );

    res.status(200).json({
      success: true,
      message:" Congratulations! You've become a Subscriber"
    })
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
});

export const updateSubAfterCancel = asyncHandler(async (req, res) => {
  const id = req?.user?.id;

  const result = await query(`SELECT * FROM users WHERE id = $1`, [id]);
  const targetUser = result.rows[0];

  if (!targetUser || !targetUser.stripe_customer_id) {
    return res.status(400).json({
      success: false,
      message: "Stripe customer ID not found",
    });
  }

  const customerId = targetUser.stripe_customer_id;

  try {
    const subStatus = await stripe.subscriptions.list({
      customer: customerId,
      status: "all",
      expand: ["data.default_payment_method"],
    });

    if (!subStatus.data.length) {
      return res.status(200).json({
        message: "No subscriptions found",
      });
    }

    const subscription = subStatus.data[0];
    const hasCanceled = subscription.cancel_at_period_end;
    const periodEnd = subscription.current_period_end;
    const currentDate = new Date();
    const endDate = new Date(periodEnd * 1000);
    const hasEnded = currentDate > endDate;

    let role = targetUser.role;
    let issubcanceled = targetUser.issubcanceled;

    if (hasCanceled && hasEnded) {
      role = "freeuser";
    } else if (hasCanceled && !hasEnded) {
      issubcanceled = "ActiveTillEnd";
    }

    const updateResult = await query(
      `UPDATE users SET subscriptions = $1, role = $2, issubcanceled = $3, updatedat = NOW() WHERE id = $4 RETURNING *`,
      [JSON.stringify(subStatus.data), role, issubcanceled, id]
    );

    return res.status(200).json(updateResult.rows[0]);

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export const customerPortal = asyncHandler(async (req, res) => {
  const id = req.user.id;

  const result = await query(`SELECT stripe_customer_id FROM users WHERE id = $1`, [id]);
  const targetUser = result.rows[0];

  if (!targetUser || !targetUser.stripe_customer_id) {
    return res.status(400).json({
      success: false,
      message: "Stripe customer ID not found",
    });
  }

  const customerId = targetUser.stripe_customer_id;

  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: process.env.APP_STRIPE_HOME_URL,
    });

    return res.status(200).json({
      success: true,
      url: portalSession.url,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export const renewSub = asyncHandler(async (req, res) => {
  const id = req?.user?.id;

  const result = await query(`SELECT * FROM users WHERE id = $1`, [id]);
  const targetUser = result.rows[0];

  if (!targetUser || !targetUser.stripe_customer_id) {
    return res.status(400).json({
      success: false,
      message: "Stripe customer ID not found",
    });
  }

  const customerId = targetUser.stripe_customer_id;

  try {
    const subStatus = await stripe.subscriptions.list({
      customer: customerId,
      status: "all",
    });

    if (!subStatus.data.length) {
      return res.status(200).json({
        message: "No subscriptions found",
      });
    }

    const subscription = subStatus.data[0];
    let role = targetUser.role;
    let issubcanceled = targetUser.issubcanceled;

    if (subscription.status === "active") {
      role = "subscriber";
      issubcanceled = "Active";
    } else {
      role = "freeuser";
    }

    const updateResult = await query(
      `UPDATE users SET subscriptions = $1, role = $2, issubcanceled = $3, updatedat = NOW() WHERE id = $4 RETURNING *`,
      [JSON.stringify(subStatus.data), role, issubcanceled, id]
    );

    return res.status(200).json(updateResult.rows[0]);

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});