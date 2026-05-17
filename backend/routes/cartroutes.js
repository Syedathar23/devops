import express from 'express';
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from '../controllers/cartController.js';
import { userAuth } from '../middleware/auth/Auth.js';

const route = express.Router();

route.get('/', userAuth, getCart);
route.post('/', userAuth, addToCart);
route.put('/:id', userAuth, updateCartItem);
route.delete('/:id', userAuth, removeFromCart);
route.delete('/', userAuth, clearCart);

export default route;
