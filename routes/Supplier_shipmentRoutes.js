const express = require("express");
const SupplierShipmentController = require("../controller/supplier_shipmentController");
const { varifay } = require("../midelware/varifay");
const { checkPermission } = require("../midelware/checkpermission");

const router = express.Router();

// ------------------- GET -------------------
router.get("/supplier_shipment/justgetall", SupplierShipmentController.justgetall);
router.get("/supplier_shipment/getAll", SupplierShipmentController.getAll);
router.post("/supplier_shipment/getById", SupplierShipmentController.getById);

// pagination / listing
router.post("/supplier_shipment/getShipments", SupplierShipmentController.getShipments);
router.post("/supplier_shipment/searchinshipments", SupplierShipmentController.searchinshipments);
router.post("/supplier_shipment/getShipmentsBySupplier", SupplierShipmentController.getShipmentsBySupplier);

// ------------------- CREATE -------------------
router.post(
  "/supplier_shipment/create/create",
  varifay,
  checkPermission(["super_admin", "Owner"]),
  SupplierShipmentController.create
);

// ------------------- UPDATE -------------------
// general update (body contains id + fields to change)
router.patch(
  "/supplier_shipment/update/update",
  varifay,
  checkPermission(["super_admin", "Owner"]),
  SupplierShipmentController.update
);

// alternate update endpoints (matching your controllers)
router.patch(
  "/supplier_shipment/update/updatewithoutuuid",
  varifay,
  checkPermission(["super_admin", "Owner"]),
  SupplierShipmentController.updatewithoutuuid
);
router.patch(
  "/supplier_shipment/update/updatewithuuid",
  varifay,
  checkPermission(["super_admin", "Owner"]),
  SupplierShipmentController.updatewithuuid
);

// update single shipment (partial fields allowed)
router.patch(
  "/supplier_shipment/update/updateShipment",
  varifay,
  checkPermission(["super_admin", "Owner"]),
  SupplierShipmentController.updateShipment
);

// ------------------- DELETE -------------------
router.delete(
  "/supplier_shipment/delete/delete",
  varifay,
  checkPermission(["super_admin", "Owner"]),
  SupplierShipmentController.delete
);
router.delete(
  "/supplier_shipment/delete/deletewithoutuuid",
  varifay,
  checkPermission(["super_admin", "Owner"]),
  SupplierShipmentController.deletewithoutuuid
);

module.exports = router;