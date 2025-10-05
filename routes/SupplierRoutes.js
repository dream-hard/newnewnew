const express = require("express");
const SupplierController = require("../controller/supplierController");
const { varifay } = require("../midelware/varifay");
const { checkPermission } = require("../midelware/checkpermission");

const router = express.Router();

// ------------------- GET -------------------
router.get("/supplier/justgetall", SupplierController.justgetall);
router.get("/supplier/getAll", SupplierController.getAll);
router.post("/supplier/getById", SupplierController.getById);
router.post("/supplier/getsupplier", SupplierController.getsupplier);
router.post("/supplier/getsupplierwithshipments", SupplierController.getsupplierwithshipments);
router.post("/supplier/getsuppliers", SupplierController.getsuppliers);
router.post("/supplier/searchsuppliers", SupplierController.searchsuppliers);

// ------------------- CREATE -------------------
router.post(
  "/supplier/create/create",
  varifay,
  checkPermission(["super_admin", "Owner"]),
  SupplierController.create
);
router.post(
  "/supplier/create/createsupplier",
  varifay,
  checkPermission(["super_admin", "Owner"]),
  SupplierController.createsupplier
);

// ------------------- UPDATE -------------------
router.patch(
  "/supplier/update/update",
  varifay,
  checkPermission(["super_admin", "Owner"]),
  SupplierController.update
);
router.patch(
  "/supplier/update/updatewithoutuuid",
  varifay,
  checkPermission(["super_admin", "Owner"]),
  SupplierController.updatewithoutuuid
);
router.patch(
  "/supplier/update/updatewithuuid",
  varifay,
  checkPermission(["super_admin", "Owner"]),
  SupplierController.updatewithuuid
);
router.post(
  "/supplier/update/updatedsupplier",
  varifay,
  checkPermission(["super_admin", "Owner"]),
  SupplierController.updatedsupplier
);

// ------------------- DELETE -------------------
router.delete(
  "/supplier/delete/delete",
  varifay,
  checkPermission(["super_admin", "Owner"]),
  SupplierController.delete
);
router.delete(
  "/supplier/delete/deletewithoutuuid",
  varifay,
  checkPermission(["super_admin", "Owner"]),
  SupplierController.deletewithoutuuid
);

module.exports = router;
