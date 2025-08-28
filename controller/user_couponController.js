const { where } = require("sequelize");
const { Coupon, User_coupon,User } = require("../models");

const { Product_statu } = require("../models");
const Product = require("../models/_products");


exports.create = async (req, res) => {
  try {
    const {user_id,coupon_id,usage_limit}=req.body;

    const  user_coupon = await User_coupon.create({
     user_id,
     coupon_id,
     usage_limit
    });
    res.status(201).json(user_coupon);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const user_coupon= await User_coupon.findAll();
    res.json(user_coupon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getByUserId = async (req, res) => {
  try {
    const {id}=req.body;
    const user_coupon = await User_coupon.findAll({where:{user_id:id}});
    if (!user_coupon) return res.status(404).json({ error: "Not found" });
    res.json(user_coupon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getBycouponcode = async (req, res) => {
  try {
    const {coupon_id}=req.body;
    const user_coupons = await User_coupon.findAll({where:{coupon_id:coupon_id}});
    if (!user_coupons) return res.status(404).json({ error: "Not found" });
    res.json(user_coupons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getBycouponAUserId = async (req, res) => {
  try {
    const {code,id}=req.body;
    const user_coupons = await User_coupon.findAll({where:{user_id:id,coupon_id:code}});
    if (!user_coupons) return res.status(404).json({ error: "Not found" });
    res.json(user_coupons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.update = async (req, res) => {
  try {
    const {code,id}=req.body;
    const old_user_coupon=await User_coupon.findOne({where:{user_id:id,coupon_id:code}});
    if(!old_user_coupon) return res.status(404).json({ error: "Not found" });
    let {usage_count}=req.body;
    if(!usage_count)usage_count=old_user_coupon.usage_count;



    const [updated] = await User_coupon.update(
      {
        usage_count
    },  
       {
      where: { coupon_id: code ,user_id:id},
    });

    if (!updated) return res.status(404).json({ error: "Not found" });
    const updatedusercoupon = await Coupon.findByPk(id);
    res.json(updatedusercoupon);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const {code,id}=req.body;
    const deleted = await User_coupon.destroy({ where: { user_id:id,coupon_id: code } });
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteuserId = async (req, res) => {
  try {
    const {id}=req.body;
    const deleted = await User_coupon.destroy({ where: { user_id:id } });
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.deletecouponcode = async (req, res) => {
  try {
    const {code}=req.body;
    const deleted = await User_coupon.destroy({ where: { coupon_id:code } });
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};