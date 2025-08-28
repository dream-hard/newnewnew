const express = require("express");
const ProductConditionController=require('../controller/productconditionController');
const { varifay } = require("../midelware/varifay");
const { headerauth } = require("../midelware/headerauth");
const { checkPermission } = require("../midelware/checkpermission");

const router=express.Router();
router.get("/productcondition/getAll",ProductConditionController.getAll)
router.get("/productcondition/getById",ProductConditionController.getById)
router.get("/productcondition/getconditions",ProductConditionController.getconditions)
router.get("/productcondition/justgetall",ProductConditionController.justgetall)
router.post("/productcondition/create/addcondition",varifay,checkPermission(["super_admin","Owner"]),ProductConditionController.addcondition)
router.patch("/productcondition/update/update",varifay,checkPermission(["super_admin","Owner"]),ProductConditionController.update)
router.delete("/productcondition/delete/delete",varifay,checkPermission(["super_admin","Owner"]),ProductConditionController.delete)
router.delete("/productcondition/delete/deletewithoutid",varifay,checkPermission(["super_admin","Owner"]),ProductConditionController.deletewithoutid)

module.exports=router;