const express = require("express");
const CategoryController = require("../controller/categoryController");

const { varifay } = require("../midelware/varifay");
const { headerauth } = require("../midelware/headerauth");
const { superadminanduponly } = require('../midelware/IssuperAdmin');
const { Owneronly } = require("../midelware/IsOwner");
const { adminanduponly } = require("../midelware/IsAdmin");
const { checkPermission } = require("../midelware/checkpermission");

const router = express.Router();

// 🟢 Category CRUD

router.get('/category/getall',CategoryController.getAll)
router.get('/category/getallcategoryids',CategoryController.getAllCategoryIds)
router.post('/category/getallnestedcategorieswithallchildren',CategoryController.getAllNestedCategorieswithallchildren)
router.get('/category/getbyuuid',CategoryController.getByUuid)
router.get('/category/getcategories',CategoryController.getcategories)
router.get('/category/getuntilrootid',CategoryController.getuntilrootid)
router.get('/category/justgetall',CategoryController.justgetall)
router.post('/category/getallcategoryleafids',CategoryController.getAllCategoryleafIds)
router.post('/category/searchincategories',CategoryController.searchincategories)
router.post('/categoryfiltercategories',CategoryController.filtercategories);
router.post('/category/create/create',varifay,checkPermission(["admin","super_admin","Owner"]),CategoryController.create)
router.post('/category/create/addcategory',varifay,checkPermission(["admin","super_admin","Owner"]),CategoryController.addcategory)
router.patch('/category/update/update',varifay,checkPermission(["admin","super_admin","Owner"]),CategoryController.update)
router.patch('/category/update/updatedcategory',varifay,checkPermission(["admin","super_admin","Owner"]),CategoryController.updatedcategory)

router.delete('/category/delete/delete',varifay,checkPermission(["admin","super_admin","Owner"]),CategoryController.delete)
router.delete('/category/delete/deletewithoutuuid',varifay,checkPermission(["admin","super_admin","Owner"]),CategoryController.deletewithoutuuid)

module.exports = router;

