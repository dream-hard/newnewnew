const express = require("express");
const AttriubteotypeController=require("../controller/attributetypeController");
const { headerauth } = require("../midelware/headerauth");
const { varifay } = require("../midelware/varifay");
const {superadminanduponly}=require('../midelware/IssuperAdmin')
const {Owneronly}=require("../midelware/IsOwner");
const { adminanduponly } = require("../midelware/IsAdmin");
const { checkPermission } = require("../midelware/checkpermission");
const router=express.Router();


router.get('/attributetype/getall',AttriubteotypeController.getAll)
router.get('/attributetype/getbyid',AttriubteotypeController.getById)
router.get('/attributetype/gettypes',AttriubteotypeController.gettypes)
router.get('/attributetype/justgetall',AttriubteotypeController.justgetall)
router.post('/attributetype/searchintypes',AttriubteotypeController.searchintypes)
router.post('/attributetype/create/addtype',varifay,checkPermission(["super_admin","Owner"]),AttriubteotypeController.addtype)
router.post('/attributetype/create/create',varifay,checkPermission(["super_admin","Owner"]),AttriubteotypeController.create)
router.patch('/attributetype/update/update',varifay,checkPermission(["super_admin","Owner"]),AttriubteotypeController.update)
router.patch('/attributetype/update/updatetype',varifay,checkPermission(["super_admin","Owner"]),AttriubteotypeController.updatetype)
router.delete('/attributetype/delete/delete',varifay,checkPermission(["super_admin","Owner"]),AttriubteotypeController.delete)
router.delete('/attributetype/delete/deletewithoutid',varifay,checkPermission(["super_admin","Owner"]),AttriubteotypeController.deletewithoutid)

module.exports=router;