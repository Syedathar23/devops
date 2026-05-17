import express from "express";
import {createProduct, deleteAllProducts, deleteProductSingle, fetchAllProducts, fetchFacebookProd, fetchFreeproducts, fetchGoogleProd, fetchPaidProd, fetchSingleProd, fetchSingleProdFree, fetchTiktokProd, updateProduct} from "../../controllers/product/product.js";
import {userAuth} from '../../middleware/auth/Auth.js';
import {upload} from '../../middleware/multer/multer.js'
import { uploadMultipleCouldinary } from "../../middleware/upload/uploadMultipleimgs.js";
const route = express.Router();

route.post("/createproduct",userAuth,upload.array("images"),uploadMultipleCouldinary,createProduct);
route.get("/fetchallproducts",userAuth,fetchAllProducts);
route.get("/fetchfreeproducts",fetchFreeproducts);
route.get("/fetchPaidProd", fetchPaidProd);
route.get("/fetchGoogleProd", fetchGoogleProd);
route.get("/fetchFacebookProd ", fetchFacebookProd);
route.get("/fetchTiktokProd", fetchTiktokProd);
route.get("/fetchSingleProd/:id", fetchSingleProd);
route.get("/fetchSingleProdFree/:id", fetchSingleProdFree);
route.put("/updateProduct/:id", userAuth, updateProduct);
route.delete("/deleteProductSingle/:id", deleteProductSingle);
route.delete("/deleteAllProducts", deleteAllProducts);
export default route;