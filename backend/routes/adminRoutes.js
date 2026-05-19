import express from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { upload } from '../middleware/multer/multer.js';
import { 
  adminLogin, 
  getDashboardStats, 
  getAllProductsAdmin, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  getAllOrdersAdmin, 
  updateOrderStatus, 
  getAllUsersAdmin, 
  getUserDetailsAdmin 
} from '../controllers/adminController.js';
import { userAuth } from '../middleware/auth/Auth.js';
import { isAdmin } from '../middleware/auth/isAdmin.js';

const router = express.Router();

// Public Admin routes
router.post('/login', adminLogin);

// Protected Admin routes
router.use(userAuth);
router.use(isAdmin);

router.get('/dashboard', getDashboardStats);

// Image Upload to Cloudinary
router.post('/upload-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    
    cloudinary.config({
        cloud_name: process.env.APP_CLOUDINARY_CLOUD_NAME,
        api_key: process.env.APP_CLOUDINARY_API_KEY,
        api_secret: process.env.APP_CLOUDINARY_SECRET_KEY, 
    });

    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: 'auto',
    });

    res.status(200).json({ success: true, url: result.secure_url });
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to upload image to Cloudinary" });
  }
});

// Product Management
router.get('/products', getAllProductsAdmin);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Order Management
router.get('/orders', getAllOrdersAdmin);
router.put('/orders/:id/status', updateOrderStatus);

// User Management
router.get('/users', getAllUsersAdmin);
router.get('/users/:id', getUserDetailsAdmin);

export default router;
