const Coupon = require('../models/_coupons.js');

exports.create = async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json(coupon);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const coupons = await Coupon.findAll();
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getByCode = async (req, res) => {
  try {
    const coupon = await Coupon.findByPk(req.params.code);
    if (!coupon) return res.status(404).json({ error: "Not found" });
    res.json(coupon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const [updated] = await Coupon.update(req.body, {
      where: { code: req.params.code },
    });
    if (!updated) return res.status(404).json({ error: "Not found" });
    const updatedCoupon = await Coupon.findByPk(req.params.code);
    res.json(updatedCoupon);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Coupon.destroy({ where: { code: req.params.code } });
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.justgetall=async(req,res)=>{
  try {
    const coupons=await Coupon.findAll({attributes:["code","product_id","isactive"],raw:true });

    res.status(200).json (coupons);
  } catch (error) {
     res.status(500).json({ error: error.message });

  }
}