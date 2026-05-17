import express from 'express';
import { createSubWindow, customerPortal, fetchAllUsers, registerUser, renewSub, resetpassword, saveProduct, stripePrices, subStausUpdate, unsaveProducts, updatePassword, updateSubAfterCancel, updateUserField, userPasswordResetAfterClick, verifyAccount, verifyAccountAfterClick } from '../controllers/users/userController.js';
import { forgotPassword } from '../controllers/users/forgotPassword.js';
import { userLogin } from '../controllers/users/userController.js';
import { testController } from '../controllers/users/userController.js';
import {userAuth} from '../middleware/auth/Auth.js';
const route = express.Router();

route.post("/register",registerUser);
route.post("/forgotpassword",forgotPassword);
route.post("/login",userLogin);
route.get("/test",userAuth,testController);
route.get("/allUsers",userAuth,fetchAllUsers);
route.get("/stripeprices",userAuth,stripePrices)
route.put("/updatepassword",updatePassword);
route.put("/resetpassword",resetpassword);
route.post("/resetpasswordafterclick",userPasswordResetAfterClick);
route.post("/verifyaccount",userAuth,verifyAccount);
route.put("/verifyaccountafterclick",verifyAccountAfterClick);
route.put("/updateuserfield",userAuth,updateUserField);
route.put("/savedproducts",userAuth,saveProduct);
route.delete("/unsaveproduct",userAuth,unsaveProducts);
route.post("/createsubscription", userAuth, createSubWindow);
route.put("/substatusupdate", userAuth, subStausUpdate);
route.put("/substatusaftercancel", userAuth, updateSubAfterCancel);
route.post("/customerportal", userAuth, customerPortal);
route.put("/renewsub", userAuth, renewSub);
export default route;