const { Op } = require("sequelize");
const {  Attribute_type,Attribute_option, Category_attribute } = require("../models");


    const orderMap = {
      "id-asc": [["id", "ASC"]],
      "id-desc": [["id", "DESC"]],
      "category-asc": [["category_id", "ASC"]],
      "category-desc": [["category_id", "DESC"]],
      "option-asc": [["attribute_option_id", "ASC"]],
      "option-desc": [["attribute_option_id", "DESC"]],
      "isfilterable-desc":[['isfilterable',"DESC"]],
      "isfilterable-asc":[['isfilterable',"ASC"]],
    };


const getCategoryAttributesGrouped = async (categoryId) => {
  const attributes = await Category_attribute.findAll({
    where: {
      category_id: categoryId,
      isfilterable: true
    },
    include: [
      {
        model: Attribute_option,
        include: [
          {
            model: Attribute_type
          }
        ]
      }
    ]
  });

  // Grouping logic
  const grouped = {};

  for (const item of attributes) {
    const option = item.Attribute_option;
    const type = option.Attribute_type;

    if (!grouped[type.id]) {
      grouped[type.id] = {
        attribute_type: {
          id: type.id,
          name: type.name,
          options: []
        }
      };
    }

    grouped[type.id].attribute_type.options.push({
      attribute_option: {
        id: option.id,
        name: option.name
      }
    });
  }

  return Object.values(grouped);
};

const getGroupedAttributesByFilterable = async (categoryId) => {

  const attributes = await Category_attribute.findAll({
    where: { category_id: categoryId },
    include: [
      {
        model: Attribute_option,
        include: [Attribute_type]
      }
    ]
  });

  const grouped = {
    filterable: {},
    non_filterable: {}
  };

  for (const item of attributes) {
    const option = item.Attribute_option;
    const type = option.Attribute_type;
    const isFilterable = item.isfilterable;

    const target = isFilterable ? grouped.filterable : grouped.non_filterable;

    if (!target[type.id]) {
      target[type.id] = {
        attribute_type: {
          id: type.id,
          name: type.name,
          options: []
        }
      };
    }

    target[type.id].attribute_type.options.push({
      attribute_option: {
        id: option.id,
        name: option.name
      }
    });
  }

  return {
    filterable: Object.values(grouped.filterable),
    non_filterable: Object.values(grouped.non_filterable)
  };
};






exports.create = async (req, res) => {
  try {
    const {attribute_id,category_id,isfilteractive}=req.body
    const pa = await Category_attribute.create({attribute_option_id:attribute_id,category_id,is_filteractive:isfilteractive});
    res.status(201).json(pa);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const pas = await Category_attribute.findAll();
    res.json(pas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.getById = async (req, res) => {
  try {
    const {id}=req.body;
    const pa = await Category_attribute.findByPk(id);
    if (!pa) return res.status(404).json({ error: "Not found" });
    res.json(pa);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getByAttributeAProductId = async (req, res) => {
  try {
    const {category_id,attribute_id}=req.body;

    const pa = await Category_attribute.findAll({where:{category_id:category_id,attribute_option_id:attribute_id}});
    if (!pa) return res.status(404).json({ error: "Not found" });
    res.json(pa);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getByProductId = async (req, res) => {
  try {
    const {category_id}=req.body;

    const pa = await Category_attribute.findAll({where:{category_id:category_id}});

    if (!pa) return res.status(404).json({ error: "Not found" });
    res.json(pa);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getByAttributetId = async (req, res) => {
  try {
    const {attribute_id}=req.body;

    const pa = await Category_attribute.findAll({where:{attribute_option_id:attribute_id}});

    if (!pa) return res.status(404).json({ error: "Not found" });
    res.json(pa);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const {id}=req.body;
    let {isfilteractive,category_id,attribute_id}=req.body;
    const old =await Category_attribute.findByPk(id);
    
    if(!isfilteractive)isfilteractive=old.is_filteractive;
    if(!category_id)category_id=old.category_id;
    if(!attribute_id)attribute_id=old.attribute_option_id;

    const [updated] = await Category_attribute.update({is_filteractive:isfilteractive,category_id:category_id,attribute_option_id:attribute_id}, {
      where: { id: id},
    });
    if (!updated) return res.status(404).json({ error: "Not found" });
    const updatedCa = await Category_attribute.findByPk(id);
    res.json(updatedCa);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Category_attribute.destroy({ where: { id: req.body.id } });
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getAttributesForCategory = async (req, res) => {
  try {
    const { categoryId } = req.body;

    const data = await getCategoryAttributesGrouped(categoryId);
    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllCategoryAttributesGrouped = async (req, res) => {
  try {
    const { categoryId } = req.body;
    const data = await getGroupedAttributesByFilterable(categoryId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getcategoryattirbutes=async (req,res)=>{
  try {
    const {page=1,limit=10,orderby}=req.body;
    page=parseInt(page);
    limit=parseInt(limit);
    let order=orderMap[orderby]||orderMap["id-asc"];
    const offset=(page-1)*limit;
    const {count,rows}=await Category_attribute.findAndCountAll({offset,order,limit});
    if(!count ||!rows)return res.status(404).json({error:"the category attribute was not found"});
    res.status(200).json({   
      Category_attribute:rows
      ,total:Array.isArray(count) ? count.length : count
      ,currentPage:Number(page)
      ,totalPages:Math.ceil((Array.isArray(count) ? count.length : count) / limit)});
  } catch (error) {
    res.status(500).json({ error: err.message });    
  }
}
exports.addcategoryattribute=async (req,res)=>{
  try {
    const {isfilterable=true,option_id,category_id}=req.body;
    if(!option_id || !category_id)return res.status(400).json({error:"you should send optionId and CategoryId please ",msg:""});
    const add=await Category_attribute.create({isfilterable,attribute_option_id:option_id,category_id:category_id},{raw:true});
    res.status(200).json({succes:true,msg:"the category option was add successfully"});
  } catch (error) {
        res.status(500).json({ error: err.message });
  }
}


exports.updatecategoryattribute=async (req,res)=>{
  try {
    const {id,isfilterable,category_id,option_id}=req.body;
    let options={};
    if(isfilterable!==null || isfilterable!==undefined)options.isfilterable=isfilterable;
    if(category_id)options.category_id=category_id;
    if(option_id)options.attribute_option_id=option_id;

    const [update]=await Category_attribute.update(options,{where:{id:id}});
    if(!update)return res.status(400).json({error:"the categroy option was not updated",msg:""});
    res.status(200).json({succes:true,msg:"the category option was updated successfully"});    
  } catch (error) {
        res.status(500).json({ error: err.message });
  }
}

exports.filterincategoryattribute=async (req,res)=>{
  try {
    const {isfilterable,id,category_id,option_id,page=1,limit=10,orderby}=req.body;
    let order=orderMap[orderby]||orderMap["id-asc"];
    let where={};
    page=parseInt(page);
    limit=parseInt(limit);
    const offset = (page -1 )* limit ;
    if( id )where.id=id;
    if(category_id)where.category_id=category_id;
    if(option_id)where.attribute_option_id=option_id;
    if(isfilterable!==undefined||isfilterable!==null)where.isfilterable=isfilterable;
    
    const {count,rows}=await Category_attribute.findAndCountAll({where,order,limit,offset});
    if(!count ||!rows)return res.status(404).json({error:"the category attribute was not found"});
    res.status(200).json({   
      Category_attribute:rows
      ,total:Array.isArray(count) ? count.length : count
      ,currentPage:Number(page)
      ,totalPages:Math.ceil((Array.isArray(count) ? count.length : count) / limit)});
  } catch (error) {
        res.status(500).json({ error: err.message });
  }
}
exports.searchincategoryattribute=async (req,res)=>{
  try {
    const {isfilterable,id,category_id,option_id,page=1,limit=10,orderby}=req.body;
    let order=orderMap[orderby]||orderMap["isfilterable-desc"];
    let where={};
    page=parseInt(page);
    limit=parseInt(limit);
    const offset = (page -1 )* limit ;
    if( id )where.id={[Op.like]:`%${id}%`};
    if(category_id)where.category_id={[Op.like]:`%${category_id}%`};
    if(option_id)where.attribute_option_id={[Op.like]:`%${option_id}%`};
    if(isfilterable!==undefined||isfilterable!==null)where.isfilterable=isfilterable;
    
    const {count,rows}=await Category_attribute.findAndCountAll({where,order,limit,offset});
    if(!count ||!rows)return res.status(404).json({error:"the category attribute was not found"});
    res.status(200).json({   
      Category_attribute:rows
      ,total:Array.isArray(count) ? count.length : count
      ,currentPage:Number(page)
      ,totalPages:Math.ceil((Array.isArray(count) ? count.length : count) / limit)});
  } catch (error) {
        res.status(500).json({ error: err.message });
  }
}

