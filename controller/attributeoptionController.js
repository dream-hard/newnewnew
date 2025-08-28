const Attribute_option = require('../models/_attribute_options.js');
const { Attribute_type, Category_attribute, Product, Product_attribute } = require('../models/index.js');

    const orderMap = {
      "id-asc": [["id", "ASC"]],
      "id-desc": [["id", "DESC"]],
      "name-asc": [["name", "ASC"]],
      "name-desc": [["name", "DESC"]],
      "type_id-desc":[['attribute_type_id',"DESC"]],
      "type_id-asc":[['attribute_type_id',"ASC"]],
    };

exports.create = async (req, res) => {
  try {
    const {attrbiute_id,name}=req.body;
    const ao = await Attribute_option.create({attrbiute_type_id:attrbiute_id,name});
    res.status(201).json(ao);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const aos = await Attribute_option.findAll();
    res.json(aos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const {id}=req.body;

    const ao = await Attribute_option.findByPk(id);
    if (!ao) return res.status(404).json({ error: "Not found" });
    res.json(ao);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getByAT=async (req,res)=>{
  try {
    const {id}=req.body;
    const ao = await Attribute_type.findAll({where:{attrbiute_type_id:id}})
    if(!ao)return res.status(404).json({error:"NOT FOUND FOR THIS TYPE"});
    res.json(ao);
  } catch (error) {
        res.status(500).json({ error: error.message });

  }
}

exports.update = async (req, res) => {
  try {
    const {id}=req.body;
    let {name ,attrbiute_type_id}=req.body;
    const old=Attribute_option.findByPk(id);
    if(!old )return res.status(404).json({error:'NOT FOUND'});
    
    if(!name)name=old.name;
    if(!attrbiute_type_id)attrbiute_type_id=old.attrbiute_type_id;

    const [updated] = await Attribute_option.update({name,attrbiute_type_id}, {
      where: { id: id },
    });
    if (!updated) return res.status(404).json({ error: "Not found" });
    const updatedAo = await Attribute_option.findByPk(id);
    res.json(updatedAo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const {id}=req.body
    const deleted = await Attribute_option.destroy({ where: { id: id } });
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.deletewithoutid=async (req,res)=>{
  try {
    const {id}=req.body;
    const old=await Attribute_option.findByPk(id);
    if(!old)return res.status(404).json({error:"NOT FOUND"});

    const update_category_attribute=await Category_attribute.update({attribute_option_id:0},{where:{attribute_option_id:id}});
    const update_product_attribute=await Product_attribute.update({attribute_option_id:0},{where:{attribute_option_id:id}});
    
    const deleted = await Attribute_option.destroy({ where: { id: id } });
    res.json({ message: "Deleted successfully" });

  } catch (error) {
        res.status(500).json({ error: error.message });
  }
}

exports.justgetall=async(req,res)=>{
  try {
    const attribute_options=await Attribute_option.findAll({attributes:["id","name"],raw:true });

    res.status(200).json (attribute_options);
  } catch (error) {
     res.status(500).json({ error: error.message });

  }
}

exports.justgettheall=async(req,res)=>{
  try {
    const attribute_options=await Attribute_option.findAll({attributes:["id","name"],raw:true, nest:true,include:[{model:Attribute_type,required:false}]});

    res.status(200).json (attribute_options);
  } catch (error) {
     res.status(500).json({ error: error.message });

  }
}


exports.getoptions=async(req,res)=>{
  try {
    const {page=1,limit=10,orderby}=req.body;
    page=parseInt(page);
    limit=parseInt(limit);
    const offset=(page-1)*limit;
    let order=orderMap[orderby]||orderMap["name-desc"];
    const {count, rows}=await Attribute_option.findAndCountAll({order,limit,offset});
    res.status(200).json({ 
      types:rows
      ,total:Array.isArray(count) ? count.length : count
      ,currentPage:Number(page)
      ,totalPages:Math.ceil((Array.isArray(count) ? count.length : count) / limit)});
  } catch (error) {
      res.status(400).json({ error: error.message });    
  }
}


exports.addoption=async (req,res)=>{
  try {
    const {name,type_id}=req.body;
    const add=await Attribute_type.create({attrbiute_type_id:type_id,name},{raw:true});
    res.status(200).json({succes:true,msg:"the type was added successfuly"});
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
}

exports.searchintypes=async(req,res)=>{
  try {
    const {id,name,type_id,page=1,limit=10,orderby}=req.body;
    let where={};
    page=parseInt(page);
    limit=parseInt(limit);
    const offset=(page-1)*limit;
    let order=orderMap[orderby]||orderMap["name-desc"];
    if(id)where.id={[Op.like]:`%${id}%`};
    if(name)where.name={[Op.like]:`%${name}%`}
    if(type_id)where.attrbiute_type_id={[Op.like]:`%${type_id}%`};
    const {count ,rows}=await Attribute_option.findAndCountAll({where,order,limit,offset});
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

exports.updateoption=async(req,res)=>{
  try {
    const {name,id,type_id}=req.body;
    let options={};
    if(name)options.name=name;
    if(type_id)options.attrbiute_type_id=type_id;
    const [update]=await Attribute_option.update({where:{id:id}},options);
    if(!update)return res.status(400).josn({error:"the type was not updated",msg:""});
    res.status(200).json({succes:true,msg:"the type was updated successfully"});
  } catch (error) {
      res.status(400).json({ error: error.message });    
  }
}

exports.justgetoptions=async(req,res)=>{
  try {
    
    let order=orderMap["type_id-asc"];
    const options=await Attribute_option.findAll({order,include:[{model:Attribute_type}]});
    res.status(200).json({ 
      options:options});
  } catch (error) {
      res.status(400).json({ error: error.message });    
  }
}