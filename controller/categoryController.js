const { where, Op } = require('sequelize');
const Category = require('../models/_categories.js');
const Product = require('../models/_products.js');

const orderMap = {
  "uuid-asc": [["uuid", "ASC"]],
  "uuid-desc": [["uuid", "DESC"]],

  "parent-asc": [["parent_category_id", "ASC"]],
  "parent-desc": [["parent_category_id", "DESC"]],

  "name-asc": [["name", "ASC"]],
  "name-desc": [["name", "DESC"]],

  "slug-asc": [["slug", "ASC"]],
  "slug-desc": [["slug", "DESC"]],

  "description-asc": [["description", "ASC"]],
  "description-desc": [["description", "DESC"]],

  "softdelete-asc": [["softdelete", "ASC"]],
  "softdelete-desc": [["softdelete", "DESC"]],

  "created-asc": [["createdAt", "ASC"]],
  "created-desc": [["createdAt", "DESC"]],
  "updated-asc": [["updatedAt", "ASC"]],
  "updated-desc": [["updatedAt", "DESC"]],
};

function arabicToLatin(text) {
  const map = {
    'ا':'a','أ':'a','إ':'i','آ':'aa','ب':'b','ت':'t','ث':'th',
    'ج':'j','ح':'h','خ':'kh','د':'d','ذ':'dh','ر':'r','ز':'z',
    'س':'s','ش':'sh','ص':'s','ض':'d','ط':'t','ظ':'z','ع':'a',
    'غ':'gh','ف':'f','ق':'q','ك':'k','ل':'l','م':'m','ن':'n',
    'ه':'h','و':'w','ي':'y','ء':'a','ئ':'a','ؤ':'a','ى':'a',
    // diacritics strip
    'ً':'','ٌ':'','ٍ':'','َ':'','ُ':'','ِ':'','ّ':'','ْ':''
  };
  return text.split('').map(c => map[c] !== undefined ? map[c] : c).join('');
}

function generateSlug(text) {
  return arabicToLatin(text)          // convert Arabic to Latin
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')    // remove remaining special characters
    .replace(/\s+/g, '-')            // replace spaces with hyphens
    .replace(/-+/g, '-')             // remove multiple hyphens
    .replace(/^-+|-+$/g, '');        // trim hyphens
}


// function buildTree(parentId = null) {
//   const children = catMap[parentId] || [];

//   return children.map(child => ({
//     ...child,
//     children: buildTree(child.id)
//   }));
// }
exports.create = async (req, res) => {
  try {
    const {parentId=null,name,description,display_name}=req.body;
    let {slug}=req.body;
    if(!slug || slug==="")
    slug=generateSlug(name);

    const category = await Category.create({
      parent_category_id:parentId,
      display_name,
      name,
      slug,
      description:description
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getByUuid = async (req, res) => {
  try {
    const {id}=req.body;
    const category = await Category.findByPk(id);
    if (!category) return res.status(404).json({ error: "Not found" });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const {id}=req.body;
    let slug;
    const old_category=await Category.findByPk(id);
    if(!old_category) return res.status(404).json({error:"Not Found"});
    let {name,description,parentId,display_name}=req.body;
    if(!name)name=old_category.name;
    if(!display_name)display_name=old_category.display_name,
    slug=generateSlug(name);
    if(!parentId)parentId=old_category.parentId;
    if(!description)description=old_category.description;



    const [updated] = await Category.update({
      parent_category_id:parentId,
      name,
      slug,
      description:description,
      display_name
    }, {
      where: { uuid: id },
    });
    if (!updated) return res.status(404).json({ error: "Not found" });
    const updatedCategory = await Category.findByPk(req.params.uuid);
    res.json(updatedCategory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const {id}=req.body;
    
    const deleted = await Category.destroy({ where: { uuid: id } });
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.deletewithoutuuid = async (req, res) => {
  try {
    const {id}=req.body;
    const updatedCategory=await Category.update({
      parent_category_id:'not connected',
    },{where:{
      parent_category_id:id
    }});
    const updatedproduct=await Product.update({
      category_id:"not connected"
    },{where:{category_id:id}});

    
    const deleted = await Category.destroy({ where: { uuid: id } });
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// working here : 


const buildChildrenMap = (allCats) => {
  return allCats.reduce((map, cat) => {
    const pid = cat.parent_category_id ?? null;
    if (!map[pid]) {
      map[pid] = [];
    }
    map[pid].push(cat);
    return map;
  }, {});
};


// دالة لبناء الشجرة من ID معين
const buildTree = (map, parentId = null,basePath = "") => {
  const children = map[parentId] || [];
  return children.map(child => {
      const currentPath = `${basePath}/${child.slug}`;

    return({
    ...child,
    link:currentPath,
    children: buildTree(map, child.uuid,currentPath)
  })});
};

// دالة لجلب عنصر واحد مع شجرته
const buildSubTree = (map, allCats, id) => {
  const target = allCats.find(c => c.uuid === id);
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
    let kids;
    if(id===null){kids =map[null]}else{ kids = map[id.uuid] || [];}
    
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
const buildCategoryMap = (categories) =>{
  Object.fromEntries(categories.map(cat => [cat.id, cat]));
}
// Helper: نحصل على سلسلة الأهل
const getParentChain = (id, allCatsMap) => {
  const chain = [];
  let current = allCatsMap[id];
  while (current && current.parent_category_id !== null) {
    const parent = allCatsMap[current.parent_category_id];
  
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
    attributes: ['uuid', "name","display_name",'parent_category_id', 'slug'],
    raw: true
  });
const childrenMap = allCats.reduce((map, cat) => {
  const pid = cat.parent_category_id ?? null;    
  if (!map[pid]) {                
    map[pid] = [];
  }
  map[pid].push(cat.uuid);
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
    let {id,deleted=false,includeall=true}=req.body;
    if(!id || id===null||id===undefined)id=null;
   
    let where={};
    if(includeall){}
    else{
    if(deleted!==undefined || deleted !==null)where.softdelete=deleted;
    }

      const allCats = await Category.findAll({
    where:where,
    attributes: ['uuid', 'parent_category_id','name', "display_name",'slug'],
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
  else{    
    all=buildSubTree(buildChildrenMap(allCats),allCats,id)
  }


  res.status(200).json(all);

    
  } catch (error) {
        res.status(500).json({ error: error.message });

  }
};

exports.getAllCategoryleafIds=async (req,res)=>{
  try {
      let {id}=req.body;
      if(id===undefined || id===null)id=null;
       const allCats = await Category.findAll({
    attributes: ['uuid', 'parent_category_id',"name","display_name", 'slug'],
    raw: true
  });
const childrenMap = allCats.reduce((map, cat) => {
  const pid = cat.parent_category_id ?? null;    
  if (!map[pid]) {                
    map[pid] = [];
  }
  map[pid].push(cat);
  return map;
}, {});

   const leafIds=buildleafids(childrenMap,id);
   if(!leafIds)return res.status(404).json({err:'not found'});
   res.status(200).json(leafIds);

  } catch (error) {
      
            res.status(500).json({ error: error.message });

  }
};


const getCategoryLeafIds = async (id) => {
  const allCats = await Category.findAll({
    attributes: ['id', 'parentId', 'slug'],
    raw: true
  });

  const childrenMap = allCats.reduce((map, cat) => {
    const pid = cat.parentId ?? null;
    if (!map[pid]) map[pid] = [];
    map[pid].push(cat.id);
    return map;
  }, {});

  return buildleafids(childrenMap, id);
};



exports.getuntilrootid=async(req,res)=>{
  try {
  const {id}=req.body;
    const categories = await Category.findAll({ raw: true });
    const map = Object.fromEntries(categories.map(cat => [cat.uuid, cat]));
    const parentChain = getParentChain(id, map);
    res.status(200).json([map[id], ...parentChain].reverse()); 
} catch (error) {
              res.status(500).json({ error: error.message });
            }
}
exports.justgetall=async(req,res)=>{
  try {
    const categories=await Category.findAll({raw:true });

    res.status(200).json (categories);
  } catch (error) {
     res.status(500).json({ error: error.message });

  }
}

exports.addcategory=async(req,res)=>{
  try {
    const {parent_id,name,description,softdeleted=false,display_name}=req.body;
    if(!parent_id || !name  ||!display_name)return res.status(400).json({error: "you should send each parent_category_id and name",msg:""});
    const slug=generateSlug(name);
    const add=await Category.create({parent_category_id:parent_id,name,slug,description,softdeleted,display_name});
    req.status(200).json({succes:true,msg:"the category was added successfully"});
  } catch (error) {
    res.status(400).json({error:error.message})
  }
}

exports.updatedcategory=async(req,res)=>{
  try {
    const {id,parent_id,name,description,softdeleted,display_name}=req.body;
    if(!id)return res.status(400).json({error:"you should send the uuid with the req ",msg:""});
    let optinos={};
    if(parent_id)optinos.parent_category_id=parent_id;
    if(name){optinos.name=name;optinos.slug=generateSlug(name)}
    if(description)optinos.description=description;
    if(display_name)optinos.display_name=display_name;
    if(softdeleted!==null || softdeleted!==undefined)optinos.softdeleted=softdeleted;
    const [update]=await Category.update(optinos,{where:{uuid:id}});
    if(!update)return res.status(400).json({error:"the category was not updated please try again",msg:""});
    res.status(200).json({succes:true,msg:"the category was updated successfully"});
  } catch (error) {
    res.status(500).json({error:error.message})
  }
}
exports.getcategories=async(req,res)=>{
  try {
    const { page=1,limit=10,orderby}=req.body;
    page=parseInt(page);
    limit=parseInt(limit);
    const offset=(page-1)*limit;
    let order=orderMap[orderby]||orderMap["created-desc"];
    const {count,rows}=await Category.findAndCountAll({order,limit,offset});
    if(!count|| !rows )return res.status(404).json({error:"not fount any categories",msg:""});
    res.status(200).json({
      succes:true,
      categories:rows
      ,total:Array.isArray(count) ? count.length : count
      ,currentPage:Number(page)
      ,totalPages:Math.ceil((Array.isArray(count) ? count.length : count) / limit)});
  } catch (error) {
    res.status(500).json({error:error.message})
  }
}
exports.filtercategories=async(req,res)=>{
  try {
    let{id,parent_id,name,slug,description,softdeleted,page=1,limit=10,orderby}=req.body;
    let where={};
    if(id)where.uuid=id;
    if(parent_id)where.parent_category_id=parent_id;
    if(name)where.name=name;
    if(slug)where.slug=slug;
    if(description)where.description={[Op.like]:`%${description}%`};
    if(typeof softdeleted==="Boolean")where.softdeleted=softdeleted;
    page=parseInt(page);
    limit=parseInt(limit);
    const offset=(page-1)*limit;
    let order=orderMap[orderby]||orderMap["created-desc"];
    const {count,rows}=await Category.findAndCountAll({order,limit,offset,where});
    if(!count|| !rows )return res.status(404).json({error:"not found any categories",msg:""});
    res.status(200).json({   
      succes:true,
      categories:rows
      ,total:Array.isArray(count) ? count.length : count
      ,currentPage:Number(page)
      ,totalPages:Math.ceil((Array.isArray(count) ? count.length : count) / limit)});
  } catch (error) {
    res.status(500).json({error:error.message})
  }
}
exports.searchincategories=async(req,res)=>{
  try {
    const{id,display_name,parent_id,name,slug,description,softdeleted,page=1,limit=10,orderby}=req.body;
    let where={};
    if(id)where.uuid={[Op.like]:`%${id}%`};
    if(parent_id)where.parent_category_id={[Op.like]:`%${parent_id}%`};
    if(name)where.name={[Op.like]:`%${name}%`};
    if(slug)where.slug={[Op.like]:`%${slug}%`};
    if(display_name)where.display_name={[Op.like]:`%${display_name}%`};
    if(description)where.description={[Op.like]:`%${description}%`};
    if(softdeleted!==null|| softdeleted!==undefined)where.softdeleted=softdeleted;
    page=parseInt(page);
    limit=parseInt(limit);
    const offset=(page-1)*limit;
    let order=orderMap[orderby]||orderMap["created-desc"];
    const {count,rows}=await Category.findAndCountAll({order,limit,offset,where});
    if(!count|| !rows )return res.status(404).json({error:"not fount any categories",msg:""});
    res.status(200).json({  
      succes:true, 
      categories:rows
      ,total:Array.isArray(count) ? count.length : count
      ,currentPage:Number(page)
      ,totalPages:Math.ceil((Array.isArray(count) ? count.length : count) / limit)});
  } catch (error) {
    res.status(500).json({error:error.message})
  }
}

