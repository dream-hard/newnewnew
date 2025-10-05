// routes/orderStatusRoutes.js
const express = require("express");
const OrderStatusController = require("../controller/orderstatusController"); // عدّل المسار لو اسم الملف مختلف
const { varifay } = require("../midelware/varifay");
const { checkPermission } = require("../midelware/checkpermission");

const router = express.Router();

// ------------------- GET -------------------
router.get("/orderstatus/justgetall", OrderStatusController.justgetall);
router.get("/orderstatus/getAll", OrderStatusController.getAll);

// ------------------- READ (by id) -------------------
router.post("/order_status/getById", OrderStatusController.getById);

// ------------------- CREATE -------------------
router.post(
  "/order_status/create",
  varifay,
  checkPermission(["super_admin", "Owner"]),
  OrderStatusController.create
);

// ------------------- UPDATE -------------------
router.patch(
  "/order_status/update",
  varifay,
  checkPermission(["super_admin", "Owner"]),
  OrderStatusController.update
);

// ------------------- DELETE -------------------
router.delete(
  "/order_status/delete",
  varifay,
  checkPermission(["super_admin", "Owner"]),
  OrderStatusController.delete
);

router.post(
  "/order_status/delete/deletewithoutid",
  varifay,
  checkPermission(["super_admin", "Owner"]),
  OrderStatusController.deletewithoutid
);

module.exports = router;
