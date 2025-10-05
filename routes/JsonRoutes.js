// routes/multiJsonRoutes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controller/multiJsonController');
const { varifay } = require("../midelware/varifay");
const { headerauth } = require("../midelware/headerauth");
const { checkPermission } = require("../midelware/checkpermission");

router.get('/json/:name', ctrl.getFile);
router.post('json/:name/replace',varifay,checkPermission(["admin","super_admin","Owner"]), express.json(), ctrl.replaceFile);
router.post('json/:name/merge',varifay,checkPermission(["admin","super_admin","Owner"]), express.json(), ctrl.mergeFile);
router.post('json/:name/clear',varifay,checkPermission(["admin","super_admin","Owner"]), express.json(), ctrl.clearFile);

router.post('json/:name/item/add', express.json(),varifay,checkPermission(["admin","super_admin","Owner"]), ctrl.addItem);
router.post('json/:name/item/remove', express.json(),varifay,checkPermission(["admin","super_admin","Owner"]), ctrl.removeItem);
router.get('/json/fetch/:fileName', ctrl.fetchProductsFromJsonWithCategoryInfo);
router.get('/json/check/:fileName',ctrl.checkifexist);

module.exports = router;
