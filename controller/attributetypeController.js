const { Op, where } = require('sequelize');
const Attribute_type = require('../models/_attribute_types.js');
const { Attribute_option } = require('../models/index.js');
    const orderMap = {
      "id-asc": [["id", "ASC"]],
      "id-desc": [["id", "DESC"]],
      "name-asc": [["name", "ASC"]],
      "name-desc": [["name", "DESC"]],
    };

exports.create = async (req, res) => {
  try {
    const {name}=req.body;
    const attribute_type = await Attribute_type.create({name});
    res.status(201).json(attribute_type);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const attribute_types = await Attribute_type.findAll();
    res.json(attribute_types);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const {id}=req.body;

    const attribute_type = await Attribute_type.findByPk(id);
    if (!attribute_type) return res.status(404).json({ error: "Not found" });
    res.json(attribute_type);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const {id}=req.body;
    let{name}=req.body;
    const [updated] = await Attribute_type.update({name}, {
      where: { id: id },
    });
    if (!updated) return res.status(404).json({ error: "Not found" });
    const updatedAt = await Attribute_type.findByPk(id);
    res.json(updatedAt);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.delete = async (req, res) => {
  try {
    const {id}=req.body;
    const deleted = await Attribute_type.destroy({ where: { id:id } });
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deletewithoutid = async (req, res) => {
  try {
    const {id}=req.body;
    const [attribute_options]= await Attribute_option.update({attribute_type_id:0},{where:{attribute_type_id:id}})
    const deleted = await Attribute_type.destroy({ where: { id:id } });
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.gettypes=async(req,res)=>{
  try {
    const {page=1,limit=10,orderby}=req.body;
    page=parseInt(page);
    limit=parseInt(limit);
    const offset=(page-1)*limit;
    let order=orderMap[orderby]||orderMap["name-desc"];
    const {count, rows}=await Attribute_type.findAndCountAll({order,limit,offset});
    res.status(200).json({ 
      types:rows
      ,total:Array.isArray(count) ? count.length : count
      ,currentPage:Number(page)
      ,totalPages:Math.ceil((Array.isArray(count) ? count.length : count) / limit)});
  } catch (error) {
      res.status(400).json({ error: error.message });    
  }
}


exports.addtype=async (req,res)=>{
  try {
    const {name}=req.body;
    const add=await Attribute_type.create({name},{raw:true});
    res.status(200).json({succes:true,msg:"the type was added successfuly"});
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
}

exports.searchintypes=async(req,res)=>{
  try {
    const {id,name,page=1,limit=10,orderby}=req.body;
    let where={};
    page=parseInt(page);
    limit=parseInt(limit);
    const offset=(page-1)*limit;
    let order=orderMap[orderby]||orderMap["name-desc"];
    if(id)where.id={[Op.like]:`%${id}%`};
    if(name)where.name={[Op.like]:`%${name}%`}
    const {count ,rows}=await Attribute_type.findAndCountAll({where,order,limit,offset});
    if(!rows || count===0)return res.status(404).json({error:"not found any types ",msg:""});
    res.status(200).json({ 
      types:rows
      ,total:Array.isArray(count) ? count.length : count
      ,currentPage:Number(page)
      ,totalPages:Math.ceil((Array.isArray(count) ? count.length : count) / limit)});
  } catch (error) {
      res.status(500).json({ error: error.message });    
  }
}

exports.updatetype=async(req,res)=>{
  try {
    const {name,id}=req.body;
    let options={};
    if(name)options.name=name;
    const [update]=await Attribute_type.update({where:{id:id}},options);
    if(!update)return res.status(400).josn({error:"the type was not updated",msg:""});
    res.status(200).json({succes:true,msg:"the type was updated successfully"});
  } catch (error) {
      res.status(400).json({ error: error.message });    
  }
}



exports.justgetall=async(req,res)=>{
  try {
    const attribute_types=await Attribute_type.findAll({attributes:["id","name"],raw:true });

    res.status(200).json (attribute_types);
  } catch (error) {
     res.status(500).json({ error: error.message });

  }
}