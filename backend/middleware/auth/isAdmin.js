import asyncHandler from "express-async-handler";

export const isAdmin = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required."
    });
  }
});
