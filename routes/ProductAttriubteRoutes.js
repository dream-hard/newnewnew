const express = require("express");
const ProductAttributeController=require('../controller/productattributeController');
const { varifay } = require("../midelware/varifay");
const { headerauth } = require("../midelware/headerauth");
const { checkPermission } = require("../midelware/checkpermission");


const router=express.Router();

router.get("/productattribute/getAll",ProductAttributeController.getAll)
router.get("/productattribute/getbyattributeaproductid",ProductAttributeController.getByAttributeAProductId)
router.get("/productattribute/getbyattributetid",ProductAttributeController.getByAttributetId)
router.get("/productattribute/getbyid",ProductAttributeController.getById)
router.get("/productattribute/getbyproductid",ProductAttributeController.getByProductId)
router.get("/productattribute/getproductattributes",ProductAttributeController.getproductattirbutes)
router.get("/productattribute/justgetall",ProductAttributeController.justgetall)
router.post("/productattribute/searchincategoryattribute",ProductAttributeController.searchincategoryattribute)
router.post("/productattribute/filterincategoryattribute",ProductAttributeController.filterincategoryattribute)
router.post("/productattribute/create/addproductattribute",varifay,checkPermission(["admin","super_admin","Owner"]),ProductAttributeController.addproductattribute)
router.patch("/productattribute/update/update",varifay,checkPermission(["admin","super_admin","Owner"]),ProductAttributeController.update);
router.delete("/productattribute/delete/delete",varifay,checkPermission(["admin","super_admin","Owner"]),ProductAttributeController.delete);


module.exports=router;