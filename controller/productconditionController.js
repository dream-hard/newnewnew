const { Product_condition } = require("../models");
const User = require("../models/_User");
const Product = require("../models/_products");

const orderMap = {
  "id-asc": [["id", "ASC"]],
  "id-desc": [["id", "DESC"]],
  "condition-asc": [["condition", "ASC"]],
  "condition-desc": [["condition", "DESC"]],
  "percent-asc": [["percent", "ASC"]],
  "percent-desc": [["percent", "DESC"]],
};

exports.addcondition = async (req, res) => {
  try {
    const {condition,percent}=req.body;

    const product_condition = await Product_condition.create({
      condition,
      percent
    });
    res.status(201).json({created:product_condition,succes:true,msg:"the condition was added successfully"});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const conditions = await Product_condition.findAll();
    res.json(conditions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const {id}=req.body;
    const condition = await Product_condition.findByPk(id);
    if (!condition) return res.status(404).json({ error: "Not found" });
    res.json(condition);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const {id}=req.body;
    const old_condition=await Product_condition.findByPk(id);
    if(!old_condition) return res.status(404).json({ error: "Not found" });
    let {condition,percent}=req.body;
    if(!condition)condition=old_condition.condition;
    if(!percent)percent=old_condition.percent;

    const [updated] = await Product_condition.update(
      {condition,
      percent},
       {
      where: { id: id },
    });
    if (!updated) return res.status(404).json({ error: "Not found" });
    const updatedCondition = await Product_condition.findByPk(id);
    res.status(200).json({updated:updatedCondition,succes:true,msg:"the product condition was updated successfully"});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const {id}=req.body;
    const deleted = await Product_condition.destroy({ where: { id: id } });
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.deletewithoutid = async (req, res) => {
  try {
    const {id}=req.body;
    const update_product=await Product.update({
      condition_id:0
    },{where:{condition_id:id}});

    const deleted = await Product_condition.destroy({ where: { id: id } });
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getconditions=async(req,res)=>{
  try {
    const {page=1,limit=10,orderby,id,condition,search=false,percent,percent_dir}=req.body;
    page=parseInt(page);
    limit=parseInt(limit);
    const offset=(page-1)*limit;
    let order=orderMap[orderby]||orderMap["id-asc"];
    let where={};
    if (percent) {
  switch (percent_dir) {
    case "eq":
      where.percent = { [Op.eq]: percent };
      break;
    case "lt":
      where.percent = { [Op.lt]: percent };
      break;
    case "lte":
      where.percent = { [Op.lte]: percent };
      break;
    case "gt":
      where.percent = { [Op.gt]: percent };
      break;
    case "gte":
      where.percent = { [Op.gte]: percent };
      break;
    default:
      where.percent = percent; // fallback exact match
      break;
  }
}
if (condition) {
  if (search) {
    where.condition = { [Op.like]: `%${condition}%` };
  } else {
    where.condition = condition;
  }
}
if (id) {
  where.id = id;
}
    const {count,rows}=await Product_condition.findAndCountAll({where,order,limit,offset});
    if(!count||!rows)return res.status(404).json({error:"was not found any product",msg:""});
    return res.status(200).json({
      conditions: rows,
      total: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


exports.justgetall=async(req,res)=>{
  try {
    const product_conditions=await Product_condition.findAll({attributes:["id","condition","percent"],raw:true });
    res.status(200).json (product_conditions);
  } catch (error) {
     res.status(500).json({ error: error.message });
  }
}