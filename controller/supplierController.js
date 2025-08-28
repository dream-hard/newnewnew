const Supplier_shipment = require("../models/_supplier_shipment");
const Supplier = require("../models/_suppliers");
const { update } = require("./categoryController");



exports.create = async (req, res) => {
  try {
    const {id,name,phoneNumber,address,metadata}=req.body;

    const supplier = await Supplier.create(
        {
            uuid:id,
            name,
            phone_number:phoneNumber,
            address,
            metadata,

        }
    );
    if(!supplier)res.status(401).json({error:"retry again please"});

    res.status(201).json(detail);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const details = await Supplier.findAll();
    res.json(details);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const {id}=req.body;
    const supplier = await Supplier.findByPk(id);
    if (!supplier) return res.status(404).json({ error: "Not found" });
    res.json(supplier);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    let {id_edit}=req.body;

    const {id,type,kind}=req.body;
    if((id_edit===undefined||id_edit===null)||(id_edit==='')){
      id_edit=id;
    }    
    const [updated] = await Supplier.update({
        uuid:id_edit,
        kind,
        type
    }, {
      where: { uuid:id },
    });
    if (!updated) return res.status(404).json({ error: "Not found" });
    const updatedDetail = await Supplier.findByPk(id_edit);
    res.json(updatedDetail);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.updatewithoutuuid=async (req,res)=>{
    try {
        let {id_edit,name,phoneNumber,address,metadata} =req.body;
        const {id} =req.body;
        const supplier= await Supplier.findByPk(id);
        if(!supplier)res.status(400).json({error:"NOT FOUND"});
        if(!id_edit){id_edit=id}else{const supplier_shipment=await Supplier_shipment.update({supplier_id:"not connected"},{where:{supplier_id:id}}) };
        if(!name)name=supplier.name;
        if(!phoneNumber)phoneNumber=supplier.phone_number;
        if(!address)address=supplier.address;
        if(!metadata)metadata=supplier.metadata;

        const [supplier_edit]= await supplier.update({
            uuid:id_edit,
            name,
            phone_number:phoneNumber,
            address,
            metadata
        },{where:{uuid:id}});

        if (!supplier_edit) return res.status(404).json({ error: "Not found" });
        const updatedsupplier = await supplier.findByPk(id_edit);
        res.status(200).json(updatedsupplier);
        
    } catch (error) {
            res.status(500).json({ error: "error was happend in the server" });

    }
}
exports.updatewithuuid=async (req,res)=>{
    try {
        let {id_edit,name,phoneNumber,address,metadata} =req.body;
        const {id} =req.body;
        const supplier= await Supplier.findByPk(id);
        if(!supplier)res.status(400).json({error:"NOT FOUND"});
        if(!id_edit){id_edit=id;}
        if(!name)name=supplier.name;
        if(!phoneNumber)phoneNumber=supplier.phone_number;
        if(!address)address=supplier.address;
        if(!metadata)metadata=supplier.metadata;

        const [supplier_edit]= await supplier.update({
            uuid:id_edit,
            name,
            phone_number:phoneNumber,
            address,
            metadata
        },{where:{uuid:id}});

        if (!supplier_edit) return res.status(404).json({ error: "Not found" });
        const updatedsupplier = await supplier.findByPk(id_edit);
        res.status(200).json(updatedsupplier);
        
    } catch (error) {
            res.status(500).json({ error: "error was happend in the server" });

    }
}


exports.delete = async (req, res) => {
  try {
    const {id}=req.body;
    const deleted = await Supplier.destroy({ where: { uuid: id } });
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.deletewithoutuuid=async (req,res)=>{
    try {
        const {id}=req.body;
        const supplier_shipment=await Supplier_shipment.update({supplier_id:"not connected"},{where:{supplier_id:id}});
        const deleted = await Supplier.destroy({ where: { uuid: id } });
        if (!deleted) return res.status(404).json({ error: "Not found" });
        res.json({ message: "Deleted successfully" });
    } catch (error) {
            res.status(500).json({ error: error.message })
    }

}

exports.getsuppliers=async (req,res)=>{
  try {
      let { orderBy ,limit=10,page=1} = req.body;
      const offset = (page - 1) * limit;

    // Default order
    let order = [["createdAt", "DESC"]];

    // Mapping query values → Sequelize order format
    const orderMap = {
      "date-asc": [["createdAt", "ASC"]],
      "date-desc": [["createdAt", "DESC"]],
      "name-asc": [["name", "ASC"]],
      "name-desc": [["name", "DESC"]],
      "phone-asc": [["phone_number", "ASC"]],
      "phone-desc": [["phone_number", "DESC"]],
      "address-asc": [["address", "ASC"]],
      "address-desc": [["address", "DESC"]],
    };

    if (orderBy && orderMap[orderBy]) {
      order = orderMap[orderBy];
    }

    const {count, rows} = await Supplier.findAndCountAll({
      attributes:["uuid","name","phone_number","address"],
      raw:true,
      order,
      limit:limit,
      offset:offset,
    });

    res.status(200).json({succes:true
      ,suppliers:rows
      ,total:Array.isArray(count) ? count.length : count
      ,currentPage:Number(page)
      ,totalPages:Math.ceil((Array.isArray(count) ? count.length : count) / limit)});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching suppliers" });
  }
}
exports.searchsuppliers = async(req,res)=>{
 try {
    const { id, name, address, phoneNumber, orderBy ,limit=10,page=1} = req.query;

    // ----------- WHERE (search filters) -----------
    const where = {};

    if (id) {
      where.uuid = id; // exact match for UUID
    }

    if (name) {
      where.name = { [Op.like]: `%${name}%` };
    }

    if (address) {
      where.address = { [Op.like]: `%${address}%` };
    }

    if (phoneNumber) {
      where.phone_number = { [Op.like]: `%${phoneNumber}%` };
    }

    // ----------- ORDER (sorting) -----------
    let order = [["createdAt", "DESC"]]; // default

    const orderMap = {
      "date-asc": ["createdAt", "ASC"],
      "date-desc": ["createdAt", "DESC"],
      "name-asc": ["name", "ASC"],
      "name-desc": ["name", "DESC"],
      "phone-asc": ["phone_number", "ASC"],
      "phone-desc": ["phone_number", "DESC"],
      "address-asc": ["address", "ASC"],
      "address-desc": ["address", "DESC"],
    };

    if (orderBy && orderMap[orderBy]) {
      order = [orderMap[orderBy]];
    }

    // ----------- QUERY -----------
    
    const {count,rows} = await Supplier.findAll({
      attributes:["uuid","name","phone_number","address"],
      offset,
      limit,

      where,
      order,
    });


    res.status(200).json({
      succes:true
      ,suppliers:rows
      ,total:Array.isArray(count) ? count.length : count
      ,currentPage:Number(page)
      ,totalPages:Math.ceil((Array.isArray(count) ? count.length : count) / limit)});  }
       catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error searching suppliers" });
  }
} 

exports.getsupplier=async(req,res)=>{
  try {
    const {id}=req.body;
    const supplier=await Supplier.findByPk(id,{
      attributes:["uuid","name","phone_number","address","CreatedAt","UpdatedAt","metadata"],
      raw:true});
    if(!supplier)return res.status(404).json({error:"NOT FOUNT supplier",msg:""});

    res.status(200).json({succes:true,supplier:supplier});
  } catch (error) {
        console.error(error);
    res.status(500).json({ message: "Error searching supplier" });
  }
}


exports.getsupplierwithshipments=async(req,res)=>{
  try {
    const {id}=req.body;
    const supplierwithshipments=await Supplier.findByPk(id,
      {
        include:[
          {model:Supplier_shipment,
            required:true,
            attributes:["id","date_received","total_cost","paid","currency","CreatedAt"],
          }
        ]
      });
        if(!supplierwithshipments)return res.status(404).json({error:"NOT FOUNT supplier",msg:""});
      res.status(200).json({succes:true,supplierwithshipments:supplierwithshipments})
  } catch (error) {
  res.status(500).json({ message: "Error searching supplier" });
    
  }
}
exports.updatedsupplier=async(req,res)=>{
  const {id ,name,phoneNumber,address,metadata,createdat,updatedat }=req.body;
  try {
    if(!id ||name||phoneNumber||address)return res.status(400).json({error:"an error found"}); 
    let update_options={
      name:name,
      phone_number:phoneNumber,
      address:address,
    }
    if(createdat)update_options.CreatedAt=createdat;
    if(updatedat)update_options.Updated=updatedat;
    if(metadata)update_options.metadata=metadata;
  
  const [supplier_update]=await Supplier.update(update_options
    ,{where:{uuid:id}});
  if(!supplier_update)res.status(400).json({error:"an error found"});
  
  res.status(200).json({succes:true,msg:"the supplier was updated"});

  } catch (error) {
      res.status(500).json({ message: "Error updating supplier",error:error.message });
  }
}

exports.createsupplier = async (req, res) => {
  try {
    const {name,phoneNumber,address,metadata}=req.body;

    const supplier = await Supplier.create(
        {
            name,
            phone_number:phoneNumber,
            address,
            metadata,

        },
        {raw:true}
    );
    if(!supplier)res.status(401).json({error:"retry again please"});

    res.status(201).json(detail);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};




exports.justgetall=async(req,res)=>{
  try {
    const suppliers=await Supplier.findAll({attributes:["uuid","name","phone_number"],raw:true });

    res.status(200).json (suppliers);
  } catch (error) {
     res.status(500).json({ error: error.message });

  }
}