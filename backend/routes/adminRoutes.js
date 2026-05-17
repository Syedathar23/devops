import express from 'express';
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
