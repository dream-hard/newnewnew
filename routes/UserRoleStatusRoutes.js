const express = require("express");
const UserROleStatusController=require("../controller/RoleStatusController");
const { headerauth } = require("../midelware/headerauth");
const { varifay } = require("../midelware/varifay");
const {superadminanduponly}=require('../midelware/IssuperAdmin')
const {Owneronly}=require("../midelware/IsOwner");
const { adminanduponly } = require("../midelware/IsAdmin");
const router=express.Router();

router.get('/RoleStatus',varifay,adminanduponly,UserROleStatusController.getAll);
router.get('/rolestatus/:id',varifay,adminanduponly,UserROleStatusController.getById);
router.post('/rolestatus/create',varifay,Owneronly,UserROleStatusController.create);
router.patch('/rolestatus',varifay,Owneronly,UserROleStatusController.update)
router.delete('/rolestatus',varifay,Owneronly,UserROleStatusController.delete);
router.delete('/rolestatuswithoutuuid',varifay,Owneronly,UserROleStatusController.deletwithoutuuid);
router.post('/rolestatus',varifay,adminanduponly,UserROleStatusController.getbykind);

module.exports=router;