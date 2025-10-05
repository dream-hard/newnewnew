// routes/adsRoutes.js
const express = require("express");
const router = express.Router();
const adsCtrl = require("../controller/adsController");
const { upload, autoProcessImages } = require("../middlewares/uploadAdsMiddleware");
adsCtrl.addad
adsCtrl.adupdate
adsCtrl.remove
adsCtrl.filterAds
adsCtrl.searchinAds
adsCtrl.toggleValid
adsCtrl.
// create ad (field name "images" or "image")
router.post("/", upload.array("images", 1), autoProcessImages, adsCtrl.create);

// get all
router.get("/", adsCtrl.getAll);

// get by id
router.get("/:id", adsCtrl.getById);

// update (allow replacing image)
router.put("/:id", upload.array("images", 1), autoProcessImages, adsCtrl.update);

// delete
router.delete("/:id", adsCtrl.remove);

// toggle validity
router.post("/:id/toggle-valid", adsCtrl.toggleValid);

module.exports = router;
