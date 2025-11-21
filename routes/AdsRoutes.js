// routes/adsRoutes.js
const express = require("express");
const router = express.Router();
const adsCtrl = require("../controller/adsController");
const { upload, autoProcessImages } = require('../midelware/uploadAdsMiddleware');
const { varifay } = require("../midelware/varifay");
const { checkPermission } = require("../midelware/checkpermission");

// create ad (field name "images" or "image")

// toggle validity
router.post("/banners/toggle-valid/:id",varifay,checkPermission(['admin','super_admin','Owner']), adsCtrl.toggleValid);

router.get('/banners/getAds',adsCtrl.getAds);
router.get('/banners/filterAds',adsCtrl.filterAds);
router.post('/banners/getonead',varifay,checkPermission(['admin','super_admin','Owner']),adsCtrl.getAd);
router.get('/banners/searchinAds',varifay,adsCtrl.searchinAds);


router.post('/banners/update/softdelete',varifay,checkPermission(['super_admin',"Owner"]),adsCtrl.softdelete);

router.post('/banners/create/addad',varifay,checkPermission(['super_admin',"Owner"]),upload.array('files',1),autoProcessImages,adsCtrl.addad);
router.patch('/banners/update/adupdate',varifay,checkPermission(['super_admin','Owner']),upload.array('files',1),autoProcessImages,adsCtrl.adupdate);
router.patch('/banners/update/updateAd',varifay,checkPermission(['super_admin','Owner']),upload.array('files',1),autoProcessImages,adsCtrl.updateAd);
router.delete('/banners/delete/remove',varifay,checkPermission(['super_admin','Owner']),adsCtrl.remove);
router.delete('/banners/delete/deleteAd',varifay,checkPermission(['super_admin','Owner']),adsCtrl.deleteAd);

module.exports = router;
