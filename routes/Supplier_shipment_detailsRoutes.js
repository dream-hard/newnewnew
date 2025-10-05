const express = require("express");
const SupplierShipmentDetailController = require("../controller/supplier_shipment_detailsController");
const { varifay } = require("../midelware/varifay");
const { checkPermission } = require("../midelware/checkpermission");

const router = express.Router();

// ------------------- GET / FETCH -------------------
router.get(
  "/supplier_shipment_detail/justgetall",
  SupplierShipmentDetailController.getAll
);
router.post(
  "/supplier_shipment_detail/getById",
  SupplierShipmentDetailController.getById
);

// list / pagination / filters
router.post(
  "/supplier_shipment_detail/getShipmentDetails",
  SupplierShipmentDetailController.getShipmentDetails
);
router.post(
  "/supplier_shipment_detail/searchinDetails",
  SupplierShipmentDetailController.searchinDetails
);

// fetch by relations
router.post(
  "/supplier_shipment_detail/getDetailsByShipment",
  SupplierShipmentDetailController.getDetailsByShipment
);
router.post(
  "/supplier_shipment_detail/getDetailsBySupplier",
  SupplierShipmentDetailController.getDetailsBySupplier
);
router.post(
  "/supplier_shipment_detail/getDetailsByProduct",
  SupplierShipmentDetailController.getDetailsByProduct
);

// ------------------- CREATE -------------------
router.post(
  "/supplier_shipment_detail/create/create",
  varifay,
  checkPermission(["super_admin", "Owner"]),
  SupplierShipmentDetailController.create
);

// smarter single create
router.post(
  "/supplier_shipment_detail/create/addShipmentDetail",
  varifay,
  checkPermission(["super_admin", "Owner"]),
  SupplierShipmentDetailController.addShipmentDetail
);

// bulk create
router.post(
  "/supplier_shipment_detail/create/bulkCreateDetails",
  varifay,
  checkPermission(["super_admin", "Owner"]),
  SupplierShipmentDetailController.bulkCreateDetails
);

// ------------------- UPDATE -------------------
router.patch(
  "/supplier_shipment_detail/update/update",
  varifay,
  checkPermission(["super_admin", "Owner"]),
  SupplierShipmentDetailController.update
);

router.patch(
  "/supplier_shipment_detail/update/updateShipmentDetail",
  varifay,
  checkPermission(["super_admin", "Owner"]),
  SupplierShipmentDetailController.updateShipmentDetail
);

// bulk update
router.patch(
  "/supplier_shipment_detail/update/bulkUpdateDetails",
  varifay,
  checkPermission(["super_admin", "Owner"]),
  SupplierShipmentDetailController.bulkUpdateDetails
);

// ------------------- DELETE -------------------
router.delete(
  "/supplier_shipment_detail/delete/delete",
  varifay,
  checkPermission(["super_admin", "Owner"]),
  SupplierShipmentDetailController.delete
);

// bulk delete
router.post(
  "/supplier_shipment_detail/delete/bulkDeleteDetails",
  varifay,
  checkPermission(["super_admin", "Owner"]),
  SupplierShipmentDetailController.bulkDeleteDetails
);

module.exports = router;
