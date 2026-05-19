import express from 'express';
import { createOrder, getUserOrders, getOrderById, createStripeCheckoutSession, confirmStripePayment } from '../controllers/orderController.js';
import { userAuth } from '../middleware/auth/Auth.js';

const route = express.Router();

route.post('/', userAuth, createOrder);
route.get('/', userAuth, getUserOrders);
route.post('/create-checkout-session', userAuth, createStripeCheckoutSession);
route.post('/confirm-payment', userAuth, confirmStripePayment);
route.get('/:id', userAuth, getOrderById);

export default route;
