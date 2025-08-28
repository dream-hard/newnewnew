const Order_statu = require('../models/_order_status.js');
const { Order } = require('../models/index.js');

exports.create = async (req, res) => {
  try {
    const {statu}=req.body;
    const status = await Order_statu.create({statu});
    res.status(201).json(status);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.getAll = async (req, res) => {
  try {
    const statuses = await Order_statu.findAll();
    res.json(statuses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const status = await Order_statu.findByPk(req.body.id);
    if (!status) return res.status(404).json({ error: "Not found" });
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const {id}=req.body;
    let{statu}=req.body;

    const old =await Order_statu.findByPk(id);
    if(!statu)statu=old.statu;


    const [updated] = await Order_statu.update({statu}, {
      where: { id: id },
    });
    if (!updated) return res.status(404).json({ error: "Not found" });
    const updatedStatus = await Order_statu.findByPk(id);
    res.json(updatedStatus);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const {id}=req.body;
    const deleted = await Order_statu.destroy({ where: { id:id} });
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deletewithoutid=async (req,res)=>{
  try {
    const id=req.body;
     
    const  [updateorder]=await  Order.update({status_id:0},{where:{status_id:id}});
      const deleted = await Order_statu.destroy({ where: { id:id} });
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
    
  } catch (error) {
    res.status(500).json({ error: error.message });

  }
}

exports.justgetall=async(req,res)=>{
  try {
    const order_status=await Order_statu.findAll({attributes:["id","statu"],raw:true });

    res.status(200).json (order_status);
  } catch (error) {
     res.status(500).json({ error: error.message });

  }
}