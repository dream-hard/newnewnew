const { Product_attribute, Attribute_option } = require("../models");

   const orderMap = {
      "id-asc": [["id", "ASC"]],
      "id-desc": [["id", "DESC"]],
      "product-asc": [["product_id", "ASC"]],
      "product-desc": [["product_id", "DESC"]],
      "option-asc": [["attribute_option_id", "ASC"]],
      "option-desc": [["attribute_option_id", "DESC"]],
      "isfilterable-desc":[['isfilterable',"DESC"]],
      "isfilterable-asc":[['isfilterable',"ASC"]],
    };
exports.addproductattribute = async (req, res) => {
  try {
    const {attribute_id,product_id,isfilteractive=true}=req.body;
    if(!attribute_id || !product_id)return res.status(400).json({error:"you should send attribute id and product id ",msg:""});
    const pa = await Product_attribute.create({attribute_option_id:attribute_id,product_id,is_filteractive:isfilteractive});
    res.status(201).json({added:pa , succes:true,msg:"the product attribute was added successfully"});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const pas = await Product_attribute.findAll();
    res.json(pas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.getById = async (req, res) => {
  try {
    const pa = await Product_attribute.findByPk(req.body.id);
    if (!pa) return res.status(404).json({ error: "Not found" });
    res.json(pa);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getByAttributeAProductId = async (req, res) => {
  try {
    const {product_id,attribute_id}=req.body;

    const pa = await Product_attribute.findAll({where:{product_id:product_id,attribute_option_id:attribute_id}});
    if (!pa) return res.status(404).json({ error: "Not found" });
    res.json(pa);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getByProductId = async (req, res) => {
  try {
    const {product_id}=req.body;

    const pa = await Product_attribute.findAll({where:{product_id:product_id}});

    if (!pa) return res.status(404).json({ error: "Not found" });
    res.json(pa);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getByAttributetId = async (req, res) => {
  try {
    const {attribute_id}=req.body;

    const pa = await Product_attribute.findAll({where:{attribute_option_id:attribute_id}});

    if (!pa) return res.status(404).json({ error: "Not found" });
    res.json(pa);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const {id}=req.body;
    let {isfilteractive,product_id,attribute_id}=req.body;
    const old =await Product_attribute.findByPk(id);
    
    if(!isfilteractive)isfilteractive=old.is_filteractive;
    if(!product_id)product_id=old.product_id;
    if(!attribute_id)attribute_id=old.attribute_option_id;

    const [updated] = await Product_attribute.update({is_filteractive:isfilteractive,product_id:product_id,attribute_option_id:attribute_id}, {
      where: { id: id},
    });
    if (!updated) return res.status(404).json({ error: "Not found" });
    const updatedPa = await Product_attribute.findByPk(id);
    res.json(updatedPa);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Product_attribute.destroy({ where: { id: req.body.id } });
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getproductattirbutes=async (req,res)=>{
  try {
    const {page=1,limit=10,orderby}=req.body;
    page=parseInt(page);
    limit=parseInt(limit);
    let order=orderMap[orderby]||orderMap["id-asc"];
    const offset=(page-1)*limit;
    const {count,rows}=await Product_attribute.findAndCountAll({offset,order,limit});
    if(!count ||!rows)return res.status(404).json({error:"the category attribute was not found"});
    res.status(200).json({   
      product_attributes:rows
      ,total:Array.isArray(count) ? count.length : count
      ,currentPage:Number(page)
      ,totalPages:Math.ceil((Array.isArray(count) ? count.length : count) / limit)});
  } catch (error) {
    res.status(500).json({ error: err.message });    
  }
}

exports.filterincategoryattribute=async (req,res)=>{
  try {
    const {is_filteractive,id,product_id,option_id,page=1,limit=10,orderby}=req.body;
    let order=orderMap[orderby]||orderMap["id-asc"];
    let where={};
    page=parseInt(page);
    limit=parseInt(limit);
    const offset = (page -1 )* limit ;
    if( id )where.id=id;
    if(product_id)where.product_id=product_id;
    if(option_id)where.attribute_option_id=option_id;
    if(is_filteractive!==undefined||is_filteractive!==null)where.is_filteractive=is_filteractive;
    
    const {count,rows}=await Product_attribute.findAndCountAll({where,order,limit,offset});
    if(!count ||!rows)return res.status(404).json({error:"the category attribute was not found"});
    res.status(200).json({   
      product_attributes:rows
      ,total:Array.isArray(count) ? count.length : count
      ,currentPage:Number(page)
      ,totalPages:Math.ceil((Array.isArray(count) ? count.length : count) / limit)});
  } catch (error) {
        res.status(500).json({ error: err.message });
  }
}
exports.searchincategoryattribute=async (req,res)=>{
  try {
    const {is_filteractive,id,product_id,option_id,page=1,limit=10,orderby}=req.body;
    let order=orderMap[orderby]||orderMap["isfilterable-desc"];
    let where={};
    page=parseInt(page);
    limit=parseInt(limit);
    const offset = (page -1 )* limit ;
    if( id )where.id={[Op.like]:`%${id}%`};
    if(product_id)where.product_id={[Op.like]:`%${product_id}%`};
    if(option_id)where.attribute_option_id={[Op.like]:`%${option_id}%`};
    if(is_filteractive!==undefined||is_filteractive!==null)where.is_filteractive=is_filteractive;
    
    const {count,rows}=await Category_attribute.findAndCountAll({where,order,limit,offset});
    if(!count ||!rows)return res.status(404).json({error:"the product attribute was not found"});
    res.status(200).json({   
      product_attributes:rows
      ,total:Array.isArray(count) ? count.length : count
      ,currentPage:Number(page)
      ,totalPages:Math.ceil((Array.isArray(count) ? count.length : count) / limit)});
  } catch (error) {
        res.status(500).json({ error: err.message });
  }
}
exports.justgetall=async(req,res)=>{
  try {
    const product_attributes=await Product_attribute.findAll({attributes:["id","condition","percent"],raw:true });
    res.status(200).json (product_attributes);
  } catch (error) {
     res.status(500).json({ error: error.message });
  }
}