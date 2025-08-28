const { Coupon, User_coupon } = require("../models");

const { Product_statu } = require("../models");
const Product = require("../models/_products");


exports.create = async (req, res) => {
  try {
    const {product_id,discounttype,discount_value,usage_limit,usage_count,start_date,end_date,isactive}=req.body;
    const product=await Product.findByPk(product_id);
    if(!product)res.status(404).json({error:"Product WAS NOT FOUND"});


    const  coupon = await Coupon.create({
     product_id,
     discounttype,
     discount_value,
     usage_count,
     usage_limit,
     start_date,
     end_date,
     isactive
    });
    res.status(201).json(coupon);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const coupon= await Coupon.findAll();
    res.json(coupon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const {code}=req.body;
    const coupon = await Coupon.findByPk(code);
    if (!coupon) return res.status(404).json({ error: "Not found" });
    res.json(coupon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getByProductId = async (req, res) => {
  try {
    const {product_id}=req.body;
    const coupons = await Coupon.findAll({where:{product_id:product_id}});
    if (!coupons) return res.status(404).json({ error: "Not found" });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getBytypeAProductId = async (req, res) => {
  try {
    const {type,product_id}=req.body;
    const coupons = await Coupon.findAll({where:{discounttype:type,product_id:product_id}});
    if (!coupons) return res.status(404).json({ error: "Not found" });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.update = async (req, res) => {
  try {
    const {code}=req.body;
    const old_coupon=await Coupon.findByPk(code);
    if(!old_coupon) return res.status(404).json({ error: "Not found" });
    let {type,product_id,discount_value,usage_count,usage_limit,start_date,end_date,isactive}=req.body;
    if(!type)type=old_coupon.discounttype;
    if(!product_id)product_id=old_coupon.product_id;
    if(!discount_value)discount_value=old_coupon.discount_value;
    if(!usage_limit)usage_limit=old_coupon.usage_limit;
    if(!usage_count)usage_count=old_coupon.usage_count;
    if(!start_date)start_date=old_coupon.start_date;
    if(!end_date)end_date=old_coupon.end_date;
    if(isactive===null||isactive===undefined)isactive=old_coupon.isactive;



    const [updated] = await Coupon.update(
      {
        product_id,
        discounttype:type,
        discount_value,
        usage_count,
        usage_limit,
        start_date,
        end_date,
        isactive
    },  
       {
      where: { code: code },
    });
    if (!updated) return res.status(404).json({ error: "Not found" });
    const updatedcoupone = await Coupon.findByPk(id);
    res.json(updatedcoupone);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const {code}=req.body;
    const deleted = await Coupon.destroy({ where: { code: code } });
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.deletewithoutcode = async (req, res) => {
  try {
    const {code}=req.body;
    const [user_coupons]=await User_coupon.update({coupon_id:"not connected"},{where:{coupon_id:code}});

    const deleted = await Coupon.destroy({ where: { code: code } });
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
