const { where } = require('sequelize');
const Category = require('../models/_categories.js');
const Product = require('../models/_products.js');
const e = require('express');
const { Order, Address, Address } = require('../models/index.js');

// order map
const orderMap = {
  "id-asc": [["id", "ASC"]],
  "id-desc": [["id", "DESC"]],
  "name-asc": [["name", "ASC"]],
  "name-desc": [["name", "DESC"]],
  "parent-asc": [["parent_id", "ASC"]],
  "parent-desc": [["parent_id", "DESC"]],
  "forfree-asc": [["forfree", "ASC"]],
  "forfree-desc": [["forfree", "DESC"]],
};

function generateSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')   // remove special characters
    .replace(/\s+/g, '-')           // replace spaces with hyphens
    .replace(/-+/g, '-')            // remove multiple hyphens
    .replace(/^-+|-+$/g, '');       // trim hyphens from start and end
}
function buildTree(parentId = null) {
  const children = catMap[parentId] || [];

  return children.map(child => ({
    ...child,
    children: buildTree(child.id)
  }));
}
exports.create = async (req, res) => {
  try {

    const {parentId,name,forfree}=req.body;
    

    const address = await Address.create({
      parent_id:parentId,
      name,
      forfree
    });
    res.status(201).json(address);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getaddress = async (req, res) => {
  try {
    const {page=1,limit=10,orderby}=req.body;
    page=parseInt(page);
    limit=parseInt(limit);
    const offset=(page-1)*limit;
    let order=orderMap[orderby]||orderMap['id-asc'];
    const {count,rows} = await Address.findAndCountAll({limit,offset,order});
    if(!count ||!rows)return res.status(404).json({error:"the product attribute was not found"});
    res.status(200).json({   
      address:rows
      ,total:Array.isArray(count) ? count.length : count
      ,currentPage:Number(page)
      ,totalPages:Math.ceil((Array.isArray(count) ? count.length : count) / limit)});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getByid = async (req, res) => {
  try {
    const {id}=req.body;
    const address = await Address.findByPk(id);
    if (!address) return res.status(404).json({ error: "Not found" });
    res.json(address);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatedaddress= async (req, res) => {
  try {
    const {id}=req.body;
    const old_address=await Address.findByPk(id);
    if(!old_address) return res.status(404).json({error:"Not Found"});
    let {name,forfree,parentId}=req.body;

    if(!name)name=old_address.name;
    if(!parentId)parentId=old_address.parent_id;
    if(!forfree)forfree=old_address.descripton;



    const [updated] = await Address.update({
      parent_id:parentId,
      name,
      forfree
    }, {
      where: { id: id },
    });
    if (!updated) return res.status(404).json({ error: "Not found" });
    const updatedaddress = await Address.findByPk(req.body.id);
    res.json({updated:updatedaddress,succes:true,msg:'the address was updated successfully'});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const {id}=req.body;
    
    const deleted = await Address.destroy({ where: { id: id } });
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.deletewithoutuuid = async (req, res) => {
  try {
    const {id}=req.body;
    const updatedaddress=await Address.update({
      parent_id:0,
    },{where:{
     parent_id:id
    }});
    const updateorder=await Order.update({
      shipping_address_id:0
    },{where:{shipping_address_id:id}});

    
    const deleted = await Address.destroy({ where: { id: id } });
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// working here : 


const buildChildrenMap = (allCats) => {
  return allCats.reduce((map, cat) => {
    const pid = cat.parentId ?? null;
    if (!map[pid]) {
      map[pid] = [];
    }
    map[pid].push(cat);
    return map;
  }, {});
};


// دالة لبناء الشجرة من ID معين
const buildTree = (map, parentId = null) => {
  const children = map[parentId] || [];
  return children.map(child => ({
    ...child,
    children: buildTree(map, child.id)
  }));
};

// دالة لجلب عنصر واحد مع شجرته
const buildSubTree = (map, allCats, id) => {
  const target = allCats.find(c => c.id === id);
  if (!target) return null;

  return {
    ...target,
    children: buildTree(map, id)
  };
};


const buildleafids=(map,rootId =null)=>{
   const leafIds = new Set();
  const stack   = [rootId];
  while (stack.length) {
    const id   = stack.pop();
    const kids = map[id] || [];
    if (kids.length === 0) {
      leafIds.add(id);
    } else {
      for (const kid of kids) {
        stack.push(kid);
      }
    }
  }

  return Array.from(leafIds);
}



// Helper: بنبني خريطة { id => الكائن }
const buildCategoryMap = (categories) =>
  Object.fromEntries(categories.map(cat => [cat.id, cat]));

// Helper: نحصل على سلسلة الأهل
const getParentChain = (id, allCatsMap) => {
  const chain = [];
  let current = allCatsMap[id];

  while (current && current.parentId !== null) {
    const parent = allCatsMap[current.parentId];
    if (parent) {
      chain.push(parent);
      current = parent;
    } else {
      break;
    }
  }

  return chain; // من الأصغر للأكبر، ما منعمل reverse
};


exports.getAllCategoryIds = async function getAllCategoryIds(rootId) {
  const allCats = await Category.findAll({
    attributes: ['id', 'parentId', 'slug'],
    raw: true
  });
const childrenMap = allCats.reduce((map, cat) => {
  const pid = cat.parentId ?? null;    
  if (!map[pid]) {                
    map[pid] = [];
  }
  map[pid].push(cat.id);
  return map;
}, {});

function collectLeafIds(rootId) {
  const leafIds = new Set();
  const stack   = [rootId];
  while (stack.length) {
    const id   = stack.pop();
    const kids = childrenMap[id] || [];
    if (kids.length === 0) {
      leafIds.add(id);
    } else {
      for (const kid of kids) {
        stack.push(kid);
      }
    }
  }

  return leafIds;
}
 

  return Array.from(collectLeafIds(rootId));
};

exports.getAllNestedCategorieswithallchildren=async(req,res)=>{

  try {
    let {id}=req.body;
    if(!id)id=null;
   

      const allCats = await Address.findAll({
    attributes: ['id', 'parent_id', "forfree"],
    raw: true
  });

const childrenMap = allCats.reduce((map, cat) => {
  const pid = cat.parentId ?? null;    
  if (!map[pid]) {                
    map[pid] = [];
  }
  map[pid].push(cat.id);
  return map;
}, {});
  let all;
  if((id===null||id===undefined)||id===""){
   all=buildTree(buildChildrenMap(allCats));}
   else{all=buildSubTree(buildChildrenMap(allCats),allCats,id)}


  res.status(200).json(all);

    
  } catch (error) {
        res.status(500).json({ error: error.message });

  }
};

exports.getAllCategoryleafIds=async (req,res)=>{
  try {
      const {id}=req.body;
       const allCats = await Address.findAll({
    attributes: ['id', 'parent_id', "forfree"],
    raw: true
  });
const childrenMap = allCats.reduce((map, cat) => {
  const pid = cat.parent_id ?? null;    
  if (!map[pid]) {                
    map[pid] = [];
  }
  map[pid].push(cat.id);
  return map;
}, {});

   const leafIds=buildleafids(childrenMap,id);
   if(!leafIds)return res.status(404).json({err:'not found'});
   res.status(200).json(leafIds);

  } catch (error) {
            res.status(500).json({ error: error.message });

  }
}

exports.getuntilrootid=async(req,res)=>{


  try {

  const {id}=req.body;
  
    const address = await Address.findAll({ raw: true });
    const map = Object.fromEntries(address.map(cat => [cat.id, cat]));
    const parentChain = getParentChain(parseInt(id), map);

    res.status(200).json([map[id], ...parentChain]); 
  
} catch (error) {

              res.status(500).json({ error: error.message });

            }
}

exports.filteraddress=async(req,res)=>{
  try {
    let {id,name,parent_id,forfree,page=1,limit=10,orderby}=req.body;
    let where={};
    page=parseInt(page);
    limit=parseInt(limit);
    const offset=(page-1)*limit;
    let order=orderMap[orderby]||orderMap['id-asc'];
    if(id)where.id=id;
    if(name)where.name=name;
    if(parent_id)where.parent_id=parent_id;
    if(forfree!==null && forfree!==undefined)where.forfree=forfree;

    const {count,rows} = await Address.findAndCountAll({where,limit,offset,order});
    if(!count ||!rows)return res.status(404).json({error:"the product attribute was not found"});
    res.status(200).json({   
      address:rows
      ,total:Array.isArray(count) ? count.length : count
      ,currentPage:Number(page)
      ,totalPages:Math.ceil((Array.isArray(count) ? count.length : count) / limit)});
  } catch (error) {
     res.status(500).json({ error: error.message });    
  }
}
exports.searchinaddress=async(req,res)=>{
  try {
    let {id,name,parent_id,forfree,page=1,limit=10,orderby}=req.body;
    let where={};
    page=parseInt(page);
    limit=parseInt(limit);
    const offset=(page-1)*limit;
    let order=orderMap[orderby]||orderMap['id-asc'];
    if(id)where.id={[Op.like]:`%${id}%`};
    if(name)where.name={[Op.like]:`%${name}%`};
    if(parent_id)where.parent_id={[Op.like]:`%${parent_id}%`};
    if(forfree!==null && forfree!==undefined)where.forfree=forfree;
    
    const {count,rows} = await Address.findAndCountAll({where,limit,offset,order});
    if(!count ||!rows)return res.status(404).json({error:"the product attribute was not found"});
    res.status(200).json({   
      succes:true,
      address:rows
      ,total:Array.isArray(count) ? count.length : count
      ,currentPage:Number(page)
      ,totalPages:Math.ceil((Array.isArray(count) ? count.length : count) / limit)});
  } catch (error) {
     res.status(500).json({ error: error.message });    
  }
}
exports.justgetall=async(req,res)=>{
  try {
    const address=await Address.findAll({attributes:["id","name"],raw:true });
    res.status(200).json (address);
  } catch (error) {
     res.status(500).json({ error: error.message });
  }
}


