const express = require("express");
const AttriubteoptionController=require("../controller/attributeoptionController");
const { headerauth } = require("../midelware/headerauth");
const { varifay } = require("../midelware/varifay");
const {superadminanduponly}=require('../midelware/IssuperAdmin')
const {Owneronly}=require("../midelware/IsOwner");
const { adminanduponly } = require("../midelware/IsAdmin");
const { checkPermission } = require("../midelware/checkpermission");
const router=express.Router();


router.get('/attributeoption/justgetall',AttriubteoptionController.justgetall)
router.get('/attributeoption/justgettheall',AttriubteoptionController.justgettheall)
router.get("/attributeoption/getoptions",AttriubteoptionController.getoptions)
router.get("/attributeoption/getbyid",AttriubteoptionController.getById)
router.get("/attributeoption/getbyat",AttriubteoptionController.getByAT)
router.get("/attributeoption/justgetoptions",AttriubteoptionController.justgetoptions)
router.get("/attributeoption/getall",AttriubteoptionController.getAll)
router.post("/attributeoption/searchintypes",AttriubteoptionController.searchintypes)
router.post('/attributeoption/create/addoption',varifay,checkPermission(["super_admin","Owner"]),AttriubteoptionController.addoption)
router.post('/attributeoption/create/create',varifay,checkPermission(['super_admin','Owner']),AttriubteoptionController.create)

router.patch('/attributeoption/update/updateoption',varifay,checkPermission(["super_admin","Owner"]),AttriubteoptionController.updateoption)
router.patch('/attributeoption/update/update',varifay,checkPermission(["super_admin","Owner"]),AttriubteoptionController.update)
router.delete('/attributeoption/delete/deltewithoutid',varifay,checkPermission(["super_admin","Owner"]),AttriubteoptionController.deletewithoutid)
router.delete('/attributeoption/delete/delete',varifay,checkPermission(["super_admin","Owner"]),AttriubteoptionController.delete)


module.exports=router;