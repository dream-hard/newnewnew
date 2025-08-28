const { where } = require("sequelize");
const { Product_statu } = require("../models");
const User = require("../models/_User");
const Product = require("../models/_products");

const orderMap = {
  "id-asc": [["id", "ASC"]],
  "id-desc": [["id", "DESC"]],
  "statu-asc": [["statu", "ASC"]],
  "statu-desc": [["statu", "DESC"]],
};


exports.create = async (req, res) => {
  try {
    const {statu}=req.body;

    const Product_statu = await Product_statu.create({
     statu
    });
    res.status(201).json(Product_statu);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const status = await Product_statu.findAll();
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const {id}=req.body;
    const status = await Product_statu.findByPk(id);
    if (!status) return res.status(404).json({ error: "Not found" });
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const {id}=req.body;
    const old_status=await Product_statu.findByPk(id);
    if(!old_status) return res.status(404).json({ error: "Not found" });
    let {statu}=req.body;
    if(!statu)statu=old_status.statu;

    const [updated] = await Product_statu.update(
      {
      statu},
       {
      where: { id: id },
    });
    if (!updated) return res.status(404).json({ error: "Not found" });
    const updatedCondition = await Product_statu.findByPk(id);
    res.json(updatedCondition);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const {id}=req.body;
    const deleted = await Product_statu.destroy({ where: { id: id } });
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
      status_id:0
    },{where:{status_id:id}});

    const deleted = await Product_statu.destroy({ where: { id: id } });
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getproductstatus=async (req,res)=>{
  try {
    const {page=1,limit=10,orderby}=req.body;
    let order=orderMap[orderby]||orderMap["id-asc"];
    page=parseInt(page);
    limit=parseInt(limit);
    const offset=(page-1)*limit;
    const {count,rows}=await Product_statu.findAndCountAll({order,limit,offset});
    if(!count ||!rows)return res.status(404).json({error:"the product attribute was not found"});
    res.status(200).json({   
      product_status:rows
      ,total:Array.isArray(count) ? count.length : count
      ,currentPage:Number(page)
      ,totalPages:Math.ceil((Array.isArray(count) ? count.length : count) / limit)});
    
  } catch (error) {
    res.status(500).json({error:error.message});
  }
}
exports.addproductstatus=async (req,res)=>{
  try {
    const {statu}=req.body;
    if(!statu)return res.status(404).json({error:"please send the status name",msg:""});
    const add=await Product_statu.create({statu},{raw:true});
    if(!add)return res.status(400).json({error:"the status was not added",msg:""});
    res.status(201).json({succes:true,msg:"the status was added successfully"});
  } catch (error) {
    res.status(400).json({error:error.message});
  }
}
exports.udpateproductstatus=async (req,res)=>{
  try {
    const{id,statu}=req.body;
    if(!id || !statu)return res.status(400).json({error:'you should send the id and status name',msg:""});
    const [update]=await Product_statu.update({where:{id:id}},{statu:statu});
    if(!update)return res.status(400).json({error:'the status was not updated',msg:""});
    res.status(200).json({succes:true,msg:"the status was updated successfully"});
  } catch (error) {
    res.status(500).json({error:error.message});
  }
}
exports.filterproductstatus=async (req,res)=>{
  try {
    const {id,statu,page=1,limit=10,orderby}=req.body;
    let order=orderMap[orderby]||orderMap["id-asc"];
    page=parseInt(page);
    limit=parseInt(limit);
    const offset=(page-1)*limit;
    let where={};
    if(id)where.id=id;
    if(statu)where.statu=statu;
    const {count,rows}=await Product_statu.findAndCountAll({where,order,limit,offset});
    if(!count ||!rows)return res.status(404).json({error:"the product attribute was not found"});
    res.status(200).json({   
      product_status:rows
      ,total:Array.isArray(count) ? count.length : count
      ,currentPage:Number(page)
      ,totalPages:Math.ceil((Array.isArray(count) ? count.length : count) / limit)});
  } catch (error) {
    res.status(500).json({error:error.message});
  }
}
exports.searchinproductstatus=async (req,res)=>{
  try {
    const {id,statu,page=1,limit=10,orderby}=req.body;
    let order=orderMap[orderby]||orderMap["id-asc"];
    page=parseInt(page);
    limit=parseInt(limit);
    const offset=(page-1)*limit;
    let where={};
    if( id )where.id={[Op.like]:`%${id}%`};
    if(statu)where.statu={[Op.like]:`%${statu}%`};
    const {count,rows}=await Product_statu.findAndCountAll({where,order,limit,offset});
    if(!count ||!rows)return res.status(404).json({error:"the product attribute was not found"});
    res.status(200).json({   
      product_status:rows
      ,total:Array.isArray(count) ? count.length : count
      ,currentPage:Number(page)
      ,totalPages:Math.ceil((Array.isArray(count) ? count.length : count) / limit)});
  } catch (error) {
    res.status(500).json({error:error.message});
  }
}
exports.justgetall=async(req,res)=>{
  try {
    const product_status=await Product_statu.findAll({attributes:["id","statu"],raw:true });

    res.status(200).json (product_status);
  } catch (error) {
     res.status(500).json({ error: error.message });

  }
}