const express = require("express");
const Exchange_rate=require('../controller/exchangerateController');
const { varifay } = require("../midelware/varifay");
const { headerauth } = require("../midelware/headerauth");
const { checkPermission } = require("../midelware/checkpermission");


const router=express.Router();

router.get('/exch_rate/getall',Exchange_rate.getAll);
router.get('/exch_rate/getbyid',Exchange_rate.getById);
router.get('/exch_rate/getjustrate',Exchange_rate.getjustrate)
router.get('/exch_rate/getrate',Exchange_rate.getrate);
router.post('/exch_rate/seachrates',Exchange_rate.searchRates);
router.post('/exch_rate/create/create',varifay,checkPermission(["super_admin","Owner"]),Exchange_rate.create);
router.post('/exch_rate/create/addrate',varifay,checkPermission(["super_admin","Owner"]),Exchange_rate.addRate);

router.patch('/exch_rate/update/update',varifay,checkPermission(["super_admin","Owner"]),Exchange_rate.update);
router.patch('/exch_rate/update/updaterate',varifay,checkPermission(["super_admin","Owner"]),Exchange_rate.updateRate);

router.delete('/exch_rate/delete/delete',varifay,checkPermission(["super_admin","Owner"]),Exchange_rate.delete);


module.exports = router;