const express = require("express");
const Exchange_rate = require('../controller/exchangerateController');
const { varifay } = require("../midelware/varifay");
const { headerauth } = require("../midelware/headerauth");
const { checkPermission } = require("../midelware/checkpermission");

const router = express.Router();

// Use POST for endpoints that expect body (pagination/filtering etc.)
router.post('/exch_rate/getall', Exchange_rate.getAll);
router.post('/exch_rate/getbyid', Exchange_rate.getById);
router.post('/exch_rate/getjustrate', Exchange_rate.getjustrate);
router.post('/exch_rate/getjustratewithrate',Exchange_rate.getjustratewithrate)
router.post('/exch_rate/getrate', Exchange_rate.getrate);
router.post('/exch_rate/seachrates', Exchange_rate.searchRates);

// create / add
router.post('/exch_rate/create/create', varifay, checkPermission(["super_admin","Owner"]), Exchange_rate.create);
router.post('/exch_rate/create/addrate', varifay, checkPermission(["super_admin","Owner"]), Exchange_rate.addRate);

// update (PATCH kept)
router.patch('/exch_rate/update/update', varifay, checkPermission(["super_admin","Owner"]), Exchange_rate.update);
router.patch('/exch_rate/update/updaterate', varifay, checkPermission(["super_admin","Owner"]), Exchange_rate.updateRate);

// delete — use POST to accept body reliably (or keep DELETE but ensure client sends body)
router.delete('/exch_rate/delete/delete', varifay, checkPermission(["super_admin","Owner"]), Exchange_rate.delete);

module.exports = router;
