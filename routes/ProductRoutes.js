const express = require("express");
const ProductController=require("../controller/productController");
const { headerauth } = require("../midelware/headerauth");
const { varifay } = require("../midelware/varifay");
const {superadminanduponly}=require('../midelware/IssuperAdmin')
const {Owneronly}=require("../midelware/IsOwner");
const { adminanduponly } = require("../midelware/IsAdmin");
const { checkPermission } = require("../midelware/checkpermission");
const { upload, autoProcessImages } = require("../midelware/upload");
const router=express.Router();


router.get('/product/justgetall',ProductController.justgetall)
router.get("/product/justgettheall",ProductController.justgettheall)
router.get('/prodcut/justgettheproduct',ProductController.justtheproduct)
router.get('/product/justgetalltheproduct',ProductController.justalltheproduct)
router.post("/product/filterproducts",ProductController.filterproducts)
router.patch('/product/update/updateproductwithimages',varifay,checkPermission(["admin","super_admin","Owner"]),upload('files',14),autoProcessImages,ProductController.updateProductWithImages);
router.post('/product/create/createproductwithimages',varifay,checkPermission(["admin","super_admin","Owner"]),upload('files',14),autoProcessImages,ProductController.updateProductWithImages);
router.delete('/product/delete/deleteProduct',varifay,checkPermission(['super_admin',"Owner"]),ProductController.deleteProduct);
module.exports=router;