const express = require("express");
const OrderController = require("../controller/orderController");
const { varifay } = require("../midelware/varifay");
const { headerauth } = require("../midelware/headerauth");
const { checkPermission } = require("../midelware/checkpermission");

const router = express.Router();

// ------------------- GET -------------------
router.get("/order/justgetall", OrderController.justgetall);
router.post("/order/justgetalltheorder", OrderController.justgetalltheorder);

router.post("/order/justgetmyorders", OrderController.justgetmyorders);

router.get("/order/justgettheorder", OrderController.justgettheorder);
router.get("/order/getAll", OrderController.getAll);
router.post("/order/getById", OrderController.getById);
router.post("/order/filterorders", OrderController.filterorders);
router.post("/order/filterorders2", OrderController.filterorders2);
router.post("/order/searchinorders", OrderController.searchinorders);
router.post("/order/searchinorders2", OrderController.searchinorders2);

// ------------------- CREATE -------------------
router.post(
  "/order/create/placeOrder",
  OrderController.placeOrder
);
router.post(
  "/order/create/create",
  varifay,
  checkPermission(["admin","super_admin", "Owner"]),
  OrderController.create
);

// ------------------- UPDATE (POST instead of PATCH) -------------------
router.post(
  "/order/update/update",
  varifay,
  checkPermission(["admin","super_admin", "Owner"]),
  OrderController.update
);
router.post(
  "/order/update/updateOrderStatus",
  varifay,
  checkPermission(["admin","super_admin", "Owner"]),
  OrderController.updateOrderStatus
);
router.post(
  "/order/update/updateOrderStatustest",
  varifay,
  checkPermission(["admin","super_admin", "Owner"]),
  OrderController.updateOrderStatustest
);
router.post("/order/update/paying",
  varifay,
  checkPermission(["admin","super_admin", "Owner"]),
  OrderController.payingorder
)
router.post("/order/update/payingtest",
  varifay,
  checkPermission(["admin","super_admin", "Owner"]),
  OrderController.payingordertest
)
// ------------------- DELETE -------------------
router.delete(
  "/order/delete/delete",
  varifay,
  checkPermission(["admin","super_admin", "Owner"]),
  OrderController.delete
);
router.delete(
  "/order/delete/deletewithoutuuid",
  varifay,
  checkPermission(["admin","super_admin", "Owner"]),
  OrderController.deletewithoutuuid
);
router.post(
  "/order/delete/softdelete",
  varifay,
  checkPermission(["admin","super_admin", "Owner"]),
  OrderController.softdelete
);

module.exports = router;
