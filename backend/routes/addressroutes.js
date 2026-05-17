import express from 'express';
import { getAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } from '../controllers/addressController.js';
import { userAuth } from '../middleware/auth/Auth.js';

const route = express.Router();

route.get('/', userAuth, getAddresses);
route.post('/', userAuth, addAddress);
route.put('/:id', userAuth, updateAddress);
route.delete('/:id', userAuth, deleteAddress);
route.patch('/:id/default', userAuth, setDefaultAddress);

export default route;
