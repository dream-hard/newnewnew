const { Op } = require('sequelize');
const Role = require('../models/_role.js');
const User = require('../models/_User.js');
const role_types=Role.role_types;
const ff=[];ff.indexOf
    const orderMap = {
      "uuid-asc": [["uuid", "ASC"]],
      "uuid-desc": [["uuid", "DESC"]],
      "kind-asc": [["kind", "ASC"]],
      "kind-desc": [["kind", "DESC"]],
      "createdAt-asc": [["createdAt", "ASC"]],
      "createdAt-desc": [["createdAt", "DESC"]],
      "updatedAt-asc": [["updatedAt", "ASC"]],
      "updatedAt-desc": [["updatedAt", "DESC"]],
    };
exports.create = async (req, res) => {
  try {
    const {id,kind}=req.body;
    if(role_types.indexOf(kind)===-1)return res.status(404).json({err:"no such kind found"});

    const detail = await Role.create(
        {
            uuid:id,
            kind,
            type
        

        }
    );
    res.status(201).json(detail);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const {page=1,limit=10,orderBy}=req.body;
    const order = orderMap[orderBy] || [["createdAt", "DESC"]];

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const offset = (page - 1) * limit;
    const {count,rows} = await Role.findAndCountAll({raw:true,order,limit,offset});

    res.json({
      total: count,
      currentPage:page,
      totalPages: Math.ceil(count / limit),
      rolesandstatus: rows,
      succes:true

    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const {id}=req.body;
    const detail = await Role.findByPk(id,{raw:true});
    if (!detail) return res.status(404).json({ error: "Not found" });
    res.status(200).json({     
      roleandstatu: detail,
      succes:true
});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    let {id_edit}=req.body;

    const {id,kind}=req.body;
    if((id_edit===undefined||id_edit===null)||(id_edit==='')){
      id_edit=id;
    }    
    const [updated] = await Role.update({
        uuid:id_edit,
        kind,
        
    }, {
      where: { uuid:id },
    });
    if (!updated) return res.status(404).json({ error: "Not found" });
    const updatedDetail = await Role.findByPk(id_edit,{raw:true});
    res.json(updatedDetail);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const {id}=req.body;
    const deleted = await Role.destroy({ where: { uuid: id } });
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deletwithoutuuid=async(req,res)=>{
  try {
    
    const {id}=req.body;
    let user=await User.update({
      role_id:"not connected"
    },{where:{
      role_id:id
    }})
    if(!user){
      user= await User.update({
        status_id:'not connected',
      },{
        where:{
          status_id:id
        }
      })
    }
    const deleted = await Role.destroy({ where: { uuid: id } });
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
    
  } catch (error) {
        res.status(500).json({ error: error.message });
  }
}

exports.getbykind= async (req,res)=>{
    try {
        const {kind}=req.body;
        const kinds=await Role.findAll({where:{
            kind:kind,
        }});
        if(!kinds)return res.status(401).json({err:"not found"});
        res.status(200).json(kinds);
        
    } catch (error) {
            res.status(500).json({ error: error.message });
        
    }
}




exports.getRoles = async (req, res) => {
  try {
    let { uuid, kind, search, orderBy, page=1, limit=10 } = req.body;

    // pagination
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const offset = (page - 1) * limit;

    // order mapping

    const order = orderMap[orderBy] || [["createdAt", "DESC"]];

    // filters
    const where = {};
    if (uuid) where.uuid = uuid;
    if (kind) where.kind = kind;

    // search
    if (search) {
      where[Op.or] = [
        { uuid: { [Op.like]: `%${search}%` } },
        { kind: { [Op.like]: `%${search}%` } }
      ];
    }

    const {rows,count} = await Role.findAndCountAll({
      where,
      limit,
      offset,
      order,
    });

    return res.status(200).json({
     total: count,
      currentPage:page,
      totalPages: Math.ceil(count / limit),
      rolesandstatus: rows,
      succes:true

    });

  } catch (error) {
    console.error("Error fetching roles:", error);
    return res.status(500).json({
      message: "Server error while fetching roles",
      error: error.message
    });
  }
};

exports.addroleorstatus=async(req,res)=>{
  try {
    const {id,kind}=req.body;
    if(!kind)return res.status(404).json({error:"not found kind"});
    if(!id)return res.status(404).json({error:"not found id name "});
    const add=await Role.create({
      kind ,
      uuid:id,
    });
    
    res.status(200).json({succes:true,roleandstatus:add});

  } catch (error) {
    console.error("Error adding roles:", error);
    return res.status(400).json({
      message: "Server error while fetching roles",
      error: error.message
      
    });
  }
}

exports.searchinrolesandstatus=async (req,res)=>{
  try {
    const {page=1,limit=10,orderBy,id,kind}=req.body;
    let where={};
    const offset=(page-1)*limit;
    const order = orderMap[orderBy] || [["createdAt", "DESC"]];
    if(kind)  
    where.uuid = { [Op.like]: `%${kind}%` };
    if(id)where.uuid={[Op.like]:`%${id}%`};

  const {count ,rows}=await Role.findAndCountAll({where,offset,limit,order});

  res.status(200).json({
      total: count,
      currentPage:page,
      totalPages: Math.ceil(count / limit),
      rolesandstatus: rows,
      succes:true
  })
  } catch (error) {
      return res.status(500).json({
      message: "Server error while fetching roles",
      error: error.message

    });
  }
}


exports.justgetall=async(req,res)=>{
  try {
    const rolesandstatus=await Role.findAll({attributes:["uuid","kind"],raw:true });

    res.status(200).json (rolesandstatus);
  } catch (error) {
     res.status(500).json({ error: error.message });

  }
}