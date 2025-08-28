const express = require("express");
const ProductStatusController=require('../controller/productstatusController');
const { varifay } = require("../midelware/varifay");
const { headerauth } = require("../midelware/headerauth");
const { checkPermission } = require("../midelware/checkpermission");

const router=express.Router();

router.get("/productstatus/justgetall",ProductStatusController.justgetall)
router.get("/productstatus/getproductstatus",ProductStatusController.getproductstatus)
router.get("/productstatus/getbyid",ProductStatusController.getById)
router.get("/productstatus/getall",ProductStatusController.getAll)
router.post("/productstatus/filterproductstatus",ProductStatusController.filterproductstatus)
router.post("/productstatus/searchinproductstatus",ProductStatusController.searchinproductstatus)
router.post("/productstatus/create/create",varifay,checkPermission(['super_admin',"Owner"]),ProductStatusController.create)
router.post("/productstatus/create/addproductstatus",varifay,checkPermission(['super_admin',"Owner"]),ProductStatusController.addproductstatus)
router.patch("/productstatus/update/update",varifay,checkPermission(['super_admin',"Owner"]),ProductStatusController.update)
router.patch("/productstatus/update/udpateproductstatus",varifay,checkPermission(['super_admin',"Owner"]),ProductStatusController.udpateproductstatus)

router.delete("/productstatus/delete/delete",varifay,checkPermission(['super_admin',"Owner"]),ProductStatusController.delete)
router.delete("/productstatus/delete/deletewithoutid",varifay,checkPermission(['super_admin',"Owner"]),ProductStatusController.deletewithoutid)

module.exports=router;