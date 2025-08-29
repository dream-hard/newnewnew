const express = require("express");

const UserController=require("../controller/userController");
const { headerauth } = require("../midelware/headerauth");
const { varifay } = require("../midelware/varifay");
const {superadminanduponly}=require('../midelware/IssuperAdmin')
const {Owneronly}=require("../midelware/IsOwner");
const { adminanduponly } = require("../midelware/IsAdmin");
const router=express.Router();

router.get('/user',varifay,Owneronly,UserController.getAll);
router.post("/user",varifay,superadminanduponly,UserController.getByUuid);
router.post("/user/create",varifay,Owneronly,UserController.create);
router.patch("/user",varifay,adminanduponly,UserController.update);
router.patch("/useruuid",varifay,superadminanduponly,UserController.updateuuid);
router.patch("/userwithoutuuid",varifay,superadminanduponly,UserController.updatewithoutuuid);
router.delete('/user',varifay,superadminanduponly,UserController.delete);
router.delete('/userwithoutuuid',varifay,superadminanduponly,UserController.deletewithoutuuid);

router.post("/login",UserController.login);
router.post("/signup",UserController.singup);
router.get("/me",varifay,headerauth,UserController.Me);
router.get('/iflogin',varifay,UserController.iflogin);
router.delete('/logout',varifay,UserController.logout);
router.post('/aslfasdlfjadsfwehupcvxz',UserController.adminsingup);
router.get('/refresh',varifay,UserController.refresh)
router.get('/user/justgetall',UserController.justgetall)
module.exports=router
