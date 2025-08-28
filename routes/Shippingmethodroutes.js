const express = require("express");
const shippingmethodcontroller=require("../controller/shippingmethodController");
const { headerauth } = require("../midelware/headerauth");
const { varifay } = require("../midelware/varifay");
const {superadminanduponly}=require('../midelware/IssuperAdmin')
const {Owneronly}=require("../midelware/IsOwner");
const { adminanduponly } = require("../midelware/IsAdmin");
const router=express.Router();
const {checkPermission}=require("../midelware/checkpermission")









router.get('/shippingmethod',varifay,checkPermission(['owner', 'super_admin', 'admin']),shippingmethodcontroller.getAll);
router.get('/shippingmethod/:id',varifay,checkPermission(['owner', 'super_admin', 'admin']),shippingmethodcontroller.getById);
router.post('/shippingmethod/create',varifay,checkPermission(['owner']),shippingmethodcontroller.create);
router.patch('/shippingmethod',varifay,checkPermission(['owner', 'super_admin']),shippingmethodcontroller.update)
router.delete('/shippingmethod',varifay,checkPermission(['owner']),shippingmethodcontroller.delete);
router.delete('/shippingmethodwithout',varifay,checkPermission(['owner']),shippingmethodcontroller.deletwithoutuuid);


module.exports=router;