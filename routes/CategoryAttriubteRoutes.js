const express = require("express");
const CategoryattributeController=require("../controller/categoryattributeController");
const { headerauth } = require("../midelware/headerauth");
const { varifay } = require("../midelware/varifay");
const {superadminanduponly}=require('../midelware/IssuperAdmin')
const {Owneronly}=require("../midelware/IsOwner");
const { adminanduponly } = require("../midelware/IsAdmin");
const { checkPermission } = require("../midelware/checkpermission");
const router=express.Router();
CategoryattributeController.addcategoryattribute
CategoryattributeController.create

CategoryattributeController.delete

CategoryattributeController.getAll
CategoryattributeController.getAllCategoryAttributesGrouped
CategoryattributeController.getAttributesForCategory
CategoryattributeController.getByAttributeAProductId
CategoryattributeController.getByAttributetId
CategoryattributeController.getById
CategoryattributeController.getByProductId
CategoryattributeController.getcategoryattirbutes
CategoryattributeController.searchincategoryattribute
CategoryattributeController.filterincategoryattribute

CategoryattributeController.update
CategoryattributeController.updatecategoryattribute

router.post('/categoryattribute/create/addcategoryattribute',varifay,checkPermission(["super_admin","Owner"]),CategoryattributeController.addcategoryattribute)
router.post('/categoryattribute/create/create',varifay,checkPermission(["super_admin","Owner"]),CategoryattributeController.create)
router.get('/categoryattribute/getAllCategoryAttributesGrouped',CategoryattributeController.getAllCategoryAttributesGrouped)
router.get('/categoryattribute/getAll',CategoryattributeController.getAll)
router.get('/categoryattribute/getAttributesForCategory',CategoryattributeController.getAttributesForCategory)
router.get('/categoryattribute/getByAttributeAProductId',CategoryattributeController.getByAttributeAProductId)
router.get('/categoryattribute/getByAttributetId',CategoryattributeController.getByAttributetId)
router.get('/categoryattribute/getById',CategoryattributeController.getById)
router.get('/categoryattribute/getByProductId',CategoryattributeController.getByProductId)
router.get('/categoryattribute/getcategoryattirbutes',CategoryattributeController.getcategoryattirbutes)
router.post('/categoryattribute/searchincategoryattribute',CategoryattributeController.searchincategoryattribute)
router.post('/categoryattribute/filterincategoryattribute',CategoryattributeController.filterincategoryattribute)

router.patch('/categoryattribute/update/updatecategoryattribute',varifay,checkPermission(["super_admin","Owner"]),CategoryattributeController.updatecategoryattribute)
router.patch('/categoryattribute/update/update',varifay,checkPermission(["super_admin","Owner"]),CategoryattributeController.update)
router.delete('/categoryattribute/delete/delete',varifay,checkPermission(["super_admin","Owner"]),CategoryattributeController.delete)

module.exports=router;