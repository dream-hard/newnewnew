const express = require("express");
const CategoryController = require("../controller/categoryController");

const { varifay } = require("../midelware/varifay");
const { headerauth } = require("../midelware/headerauth");
const { superadminanduponly } = require('../midelware/IssuperAdmin');
const { Owneronly } = require("../midelware/IsOwner");
const { adminanduponly } = require("../midelware/IsAdmin");

const router = express.Router();

// 🟢 Category CRUD
router.post("/category/create", CategoryController.create);
router.get("/category", CategoryController.getAll);
router.post("/category/one", varifay, CategoryController.getByUuid);
router.patch("/category", varifay, adminanduponly, CategoryController.update);
router.delete("/category", varifay, superadminanduponly, CategoryController.delete);
router.delete("/categorywithoutuuid", varifay, superadminanduponly, CategoryController.deletewithoutuuid);

// 🌳 Category Tree & IDs
router.post("/category/tree", CategoryController.getAllNestedCategorieswithallchildren);
router.post("/category/leafids", CategoryController.getAllCategoryleafIds);
router.post("/category/parentchain", CategoryController.getuntilrootid);


module.exports = router;
