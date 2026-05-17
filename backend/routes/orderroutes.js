import express from 'express';
import { createOrder, getUserOrders, getOrderById } from '../controllers/orderController.js';
import { userAuth } from '../middleware/auth/Auth.js';

const route = express.Router();

route.post('/', userAuth, createOrder);
route.get('/', userAuth, getUserOrders);
route.get('/:id', userAuth, getOrderById);

export default route;
