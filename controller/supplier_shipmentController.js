const Supplier_shipment = require("../models/_supplier_shipment");
const Supplier_shipment_detail = require("../models/_supplier_shipment_details");
const Supplier = require("../models/_suppliers");



exports.create = async (req, res) => {
  try {
    
    const {supplier_id,date_received,total_cost,paid}=req.body;
    const supplier=await Supplier.findByPk(supplier_id);
    if(!supplier)res.status(400).json({error:"SUPPLiER WAS NOT FOUND PLease retry"});
    


    const supplier_shipment = await Supplier_shipment.create(
        {
            
            supplier_id:supplier_id,
            date_received:date_received,
            total_cost:total_cost,
            paid:paid,
            currency:req.body.currency,
        }
    );

    if(!supplier_shipment)res.status(401).json({error:"retry again please"});

    res.status(201).json(supplier_shipment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const supplier_shipment = await Supplier.findAll();
    res.status(200).json(supplier_shipment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const {id}=req.body;
    const supplier_shipment = await Supplier_shipment.findByPk(id);
    if (!supplier_shipment) return res.status(404).json({ error: "Not found" });
    res.json(supplier_shipment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    
    const {id,supplier_id,date_received,total_cost,paid}=req.body;
    if((id===undefined||id===null)||(id==='')){
    res.status(400).json({error:"PLEASE TRY AGAIN"});
    }


    const [updated] = await Supplier_shipment.update({
        supplier_id,
        date_received,
        total_cost,
        paid
    }, {
      where: { id:id },
    });
    if (!updated) return res.status(404).json({ error: "Not found" });
    const updatedDetail = await Supplier_shipment.findByPk(id);

    res.json(updatedDetail);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.updatewithoutuuid=async (req,res)=>{
    try {
        let {id_edit,supplier_id,date_received,total_cost,paid} =req.body;
        const {id} =req.body;
        const supplier_shipment= await Supplier_shipment.findByPk(id);
        if(!Supplier_shipment)res.status(400).json({error:"NOT FOUND"});
        if(!id_edit){id_edit=id}else{const Supplier_shipment_detail=await Supplier_shipment_detail.update({supplier_shimpent_id:0},{where:{supplier_shipment_id:id}}) };
        if(!supplier_id)supplier_id=supplier_shipment.supplier_id;
        if(!date_received)date_received=supplier_shipment.date_received;
        if(!total_cost)total_cost=Supplier_shipment.total_cost;
        if(!paid)paid=Supplier_shipment.paid;

        const [supplier_shimpent_edit]= await supplier.update({
            id:id_edit,
            supplier_id,
            date_received,
            total_cost,
            paid
        },{where:{id:id}});

        if (!supplier_shimpent_edit) return res.status(404).json({ error: "Not found" });
        const updatedsupplier = await supplier_shipment.findByPk(id_edit);
        res.status(200).json(updatedsupplier);
        
    } catch (error) {
            res.status(500).json({ error: "error was happend in the server" });

    }
}
exports.updatewithuuid=async (req,res)=>{
    try {
        let {id_edit,supplier_id,date_received,total_cost,paid} =req.body;
        const {id} =req.body;
        const supplier_shipment= await Supplier_shipment.findByPk(id);
        if(!supplier_shipment)res.status(400).json({error:"NOT FOUND"});
        if(!id_edit){id_edit=id;}
        if(!supplier_id)supplier_id=supplier_shipment.supplier_id;
        if(!date_received)date_received=supplier_shipment.date_received;
        if(!total_cost)total_cost=supplier_shipment.total_cost;
        if(!paid)paid=Supplier_shipment.paid;

        const [supplier_shipment_edit]= await supplier.update({
            id:id_edit,
            supplier_id,
            date_received,
            total_cost,
            paid
        },{where:{id:id}});

        if (!supplier_shipment_edit) return res.status(404).json({ error: "Not found" });
        const updatedsupplier = await Supplier_shipment.findByPk(id_edit);
        res.status(200).json(updatedsupplier);
        
    } catch (error) {
            res.status(500).json({ error: "error was happend in the server" });

    }
}


exports.delete = async (req, res) => {
  try {
    const {id}=req.query;
    const deleted = await Supplier_shipment.destroy({ where: { id: id } });
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    
    res.status(500).json({ error: error.message });
  }
};
exports.deletewithoutuuid=async (req,res)=>{
    try {
        const {id}=req.body;
        const supplier_shipment_details=await Supplier_shipment_detail.update({supplier_shipment_id:0},{where:{supplier_shipment_id:id}});
        const deleted = await Supplier_shipment.destroy({ where: { id: id } });
        if (!deleted) return res.status(404).json({ error: "Not found" });
        res.json({ message: "Deleted successfully" });
    } catch (error) {
            res.status(500).json({ error: error.message })
    }

}

exports.getShipments = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      orderBy = "date_received-desc", // default
    } = req.body;

    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;

    // ✅ Order mapping
    const orderMap = {
      "date_received-asc": [["date_received", "ASC"]],
      "date_received-desc": [["date_received", "DESC"]],
      "paid-asc": [["paid", "ASC"]],
      "paid-desc": [["paid", "DESC"]],
      "total_cost-asc": [["total_cost", "ASC"]],
      "total_cost-desc": [["total_cost", "DESC"]],
      "currency-asc": [["currency", "ASC"]],
      "currency-desc": [["currency", "DESC"]],
      "supplier_id-asc": [["supplier_id", "ASC"]],
      "supplier_id-desc": [["supplier_id", "DESC"]],
      "createdAt-asc": [["createdAt", "ASC"]],
      "createdAt-desc": [["createdAt", "DESC"]],
      "updatedAt-asc": [["updatedAt", "ASC"]],
      "updatedAt-desc": [["updatedAt", "DESC"]],
    };

    // fallback if not found
    const order = orderMap[orderBy] || [["date_received", "DESC"]];

    // fetch shipments
    const { count, rows } = await Supplier_shipment.findAndCountAll({
      include: [
        {
          model: Supplier,
          attributes: ["uuid", "name", "address", "phone_number"],
        },
      ],
      order,
      limit,
      offset,
    });

    return res.status(200).json({
      succes:true,
      total: count,
      currentPage:page,

      totalPages: Math.ceil(count / limit),
      shipments: rows,
    });
  } catch (err) {
    console.error("Error fetching shipments:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};


exports.searchinshipments = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      orderBy = "date_received-desc",
      supplier_id,
      id,
      date_received,
      date_condition, // before / after / equal
      paid,
      paid_condition, // before / after / equal
      total_cost,
      total_condition, // before / after / equal
      currency,
    } = req.body;

    // pagination
    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;

    // ✅ order mapping
    const orderMap = {
      "date_received-asc": [["date_received", "ASC"]],
      "date_received-desc": [["date_received", "DESC"]],
      "paid-asc": [["paid", "ASC"]],
      "paid-desc": [["paid", "DESC"]],
      "total_cost-asc": [["total_cost", "ASC"]],
      "total_cost-desc": [["total_cost", "DESC"]],
      "currency-asc": [["currency", "ASC"]],
      "currency-desc": [["currency", "DESC"]],
      "supplier_id-asc": [["supplier_id", "ASC"]],
      "supplier_id-desc": [["supplier_id", "DESC"]],
      "createdAt-asc": [["createdAt", "ASC"]],
      "createdAt-desc": [["createdAt", "DESC"]],
      "updatedAt-asc": [["updatedAt", "ASC"]],
      "updatedAt-desc": [["updatedAt", "DESC"]],
    };
    const order = orderMap[orderBy] || [["date_received", "DESC"]];

    // ✅ filters
    const where = {};

    if (supplier_id) where.supplier_id = supplier_id;
    if (id) where.id = id;

    // date_received filter
    if (date_received) {
      if (date_condition === "lower") where.date_received = { [Op.lt]: date_received };
      else if (date_condition === "bigger") where.date_received = { [Op.gt]: date_received };
      else where.date_received = { [Op.eq]: date_received };
    }

    // paid filter
    if (paid) {
      if (paid_condition === "lower") where.paid = { [Op.lt]: paid };
      else if (paid_condition === "bigger") where.paid = { [Op.gt]: paid };
      else where.paid = { [Op.eq]: paid };
    }

    // total_cost filter
    if (total_cost) {
      if (total_condition === "lower") where.total_cost = { [Op.lt]: total_cost };
      else if (total_condition === "bigger") where.total_cost = { [Op.gt]: total_cost };
      else where.total_cost = { [Op.eq]: total_cost };
    }

    // currency filter (exact match)
    if (currency) where.currency = currency;

    // ✅ fetch
    const { count, rows } = await Supplier_shipment.findAndCountAll({
      where,
      include: [
        {
          model: Supplier,
          attributes: ["uuid", "name", "address", "phone_number"],
        },
      ],
      order,
      limit,
      offset,
      
    });

    return res.status(200).json({
      total: count,
      currentPage:page,
      totalPages: Math.ceil(count / limit),
      shipments: rows,
      succes:true

    });
  } catch (err) {
    console.error("Error fetching shipments:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};


exports.updateShipment = async (req, res) => {
  try {
    const { id } = req.body; // shipment id from URL
    const {
      supplier_id,
      date_received,
      total_cost,
      paid,
      currency,
    } = req.body;

    // find shipment
    const shipment = await Supplier_shipment.findByPk(id);
    if (!shipment) {
      return res.status(404).json({ message: "Shipment not found" });
    }

    // ✅ update only provided fields
    if (supplier_id !== undefined) shipment.supplier_id = supplier_id;
    if (date_received !== undefined) shipment.date_received = date_received;
    if (total_cost !== undefined) shipment.total_cost = total_cost;
    if (paid !== undefined) shipment.paid = paid;
    if (currency !== undefined) shipment.currency = currency;

    await shipment.save();

    return res.status(200).json({

      succes:true,
      message: "Shipment updated successfully",
      shipment,
    });
  } catch (err) {
    console.error("Error updating shipment:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};



exports.getShipmentsBySupplier = async (req, res) => {
  try {
    const { supplier_id } = req.body; // supplier UUID from URL
    let {
      page = 1,
      limit = 10,
      orderBy = "date_received-desc",
    } = req.body; // optional pagination + ordering from body

    if (!supplier_id) {
      return res.status(400).json({ message: "supplier_id is required" });
    }

    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;

    // order mapping
    const orderMap = {
      "date_received-asc": [["date_received", "ASC"]],
      "date_received-desc": [["date_received", "DESC"]],
      "paid-asc": [["paid", "ASC"]],
      "paid-desc": [["paid", "DESC"]],
      "total_cost-asc": [["total_cost", "ASC"]],
      "total_cost-desc": [["total_cost", "DESC"]],
      "currency-asc": [["currency", "ASC"]],
      "currency-desc": [["currency", "DESC"]],
      "createdAt-asc": [["createdAt", "ASC"]],
      "createdAt-desc": [["createdAt", "DESC"]],
      "updatedAt-asc": [["updatedAt", "ASC"]],
      "updatedAt-desc": [["updatedAt", "DESC"]],
    };
    const order = orderMap[orderBy] || [["date_received", "DESC"]];

    // fetch shipments for this supplier
    const { count, rows } = await Supplier_shipment.findAndCountAll({
      where: { supplier_id },
      attributes:["id","supplier_id","date_received","total_cost","paid","currency"],
      include: [
        {
          model: Supplier,
          attributes: ["uuid", "name"],
        },
      ],
      order,
      limit,
      offset,
      raw:true
    });

    return res.status(200).json({
      total: count,
      currentPage:page,
      totalPages: Math.ceil(count / limit),
      shipments: rows,
      succes:true
    });
  } catch (err) {
    console.error("Error fetching shipments by supplier:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};


exports.justgetall=async(req,res)=>{
  try {
    const supplier_shipments=await Supplier_shipment.findAll({attributes:["id","supplier_id","date_received",'total_cost',"currency"],raw:true });

    res.status(200).json (supplier_shipments);
  } catch (error) {
     res.status(500).json({ error: error.message });

  }
}