const { Op } = require('sequelize');
const { Shipping_method, Shipping } = require('../models');



exports.create = async (req, res) => {
  try {
    const {name,cost}=req.body;

    const method = await Shipping_method.create(
        {
            name,
            cost ,
        }
    );
    res.status(201).json(method);
  } catch (error) { 
    res.status(400).json({ error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const methods = await Shipping_method.findAll();
    res.json(methods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const {id}=req.body;

    const methods = await Shipping_method.findByPk(id,{raw:true});
    if (!methods) return res.status(404).json({ error: "Not found" });
    res.json(methods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const {id}=req.body;

    const {name,cost}=req.body;
  
    const [updated] = await Shipping_method.update({
        name:name,
        cost:cost
    }, {
      where: { id:id },
    });
    if (!updated) return res.status(404).json({ error: "Not found" });
    const updatedDetail = await Shipping_method.findByPk(id,{raw:true});
    res.json(updatedDetail);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const {id}=req.body;
    const deleted = await Shipping_method.destroy({ where: { id: id } });
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.deletwithoutuuid=async(req,res)=>{
  try {
    
    const {id}=req.body;

    
    const shipping=await Shipping.update({
      type:0,
    },{where:{
      type:id
    }});
    

    const deleted = await Shipping_method.destroy({where: { id: id }});
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
    
  } catch (error) {
        res.status(500).json({ error: error.message });
  }
}


