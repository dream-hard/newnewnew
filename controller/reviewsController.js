const Review = require("../models/_reviews");

const { Product_statu } = require("../models");
const User = require("../models/_User");
const Product = require("../models/_products");


exports.create = async (req, res) => {
  try {
    const {user_id,product_id,rating,review,satus,isactive}=req.body;


    const reviews = await Review.create({
     user_id,
     product_id,
     rating,
     review,
     status,
     isactive
    });
    res.status(201).json(reviews);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const reviews = await Review.findAll();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const {id}=req.body;
    const reviews = await Review.findByPk(id);
    if (!reviews) return res.status(404).json({ error: "Not found" });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getByUserId = async (req, res) => {
  try {
    const {user_id}=req.body;
    const reviews = await Review.findAll({where:{user_id:user_id}});
    if (!reviews) return res.status(404).json({ error: "Not found" });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getByProductId = async (req, res) => {
  try {
    const {product_id}=req.body;
    const reviews = await Review.findAll({where:{product_id:product_id}});
    if (!reviews) return res.status(404).json({ error: "Not found" });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getByUserAProductId = async (req, res) => {
  try {
    const {user_id,product_id}=req.body;
    const reviews = await Review.findAll({where:{user_id:user_id,product_id:product_id}});
    if (!reviews) return res.status(404).json({ error: "Not found" });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.update = async (req, res) => {
  try {
    const {id}=req.body;
    const old_review=await Review.findByPk(id);
    if(!old_review) return res.status(404).json({ error: "Not found" });
    let {status,user_id,product_id,rating,review,isactive}=req.body;
    if(!status)status=old_review.status;
    if(!user_id)user_id=old_review.user_id;
    if(!product_id)product_id=old_review.product_id;
    if(!rating)rating=old_review.rating;
    if(!review)review=old_review.review;
    if(!isactive)isactive=old_review.isactive;


    const [updated] = await Review.update(
      {
        status,
        user_id,
        product_id,
        rating,
        review,
        status,
        isactive
    },  
       {
      where: { id: id },
    });
    if (!updated) return res.status(404).json({ error: "Not found" });
    const updatedreview = await Review.findByPk(id);
    res.json(updatedreview);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const {id}=req.body;
    const deleted = await Review.destroy({ where: { id: id } });
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
