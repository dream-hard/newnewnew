const express = require("express");
const CurrencyController=require('../controller/currencyController');
const { varifay } = require("../midelware/varifay");
const { headerauth } = require("../midelware/headerauth");
const { checkPermission } = require("../midelware/checkpermission");

const router=express.Router();

router.get('/currency/justgetall',CurrencyController.justgetall);
router.get('/currency/getAllCurrencies',CurrencyController.getAllCurrencies);
router.post('/currency/getCurrencyByIso',CurrencyController.getCurrencyByIso);
router.post('/currency/searchcurrency',CurrencyController.searchcurrency);
router.post('/currency/create/createCurrency',varifay,checkPermission(["super_admin","Owner"]),CurrencyController.createCurrency);
router.patch('/currency/update/updateCurrency',varifay,checkPermission(["super_admin","Owner"]),CurrencyController.updateCurrency)
router.delete('/currency/delete/deleteCurrency',varifay,checkPermission(["super_admin","Owner"]),CurrencyController.deleteCurrency);
router.delete('/currency/delete/deleteCurrencywithouteffect',varifay,checkPermission(["super_admin","Owner"]),CurrencyController.deleteCurrencywithouteffect);

module.exports=router;