
const { Image_type, Product_image } = require("../models");
const Product = require("../models/_products");
const Supplier_shipment = require("../models/_supplier_shipment");
const Supplier_shipment_detail = require("../models/_supplier_shipment_details");
const Supplier = require("../models/_suppliers");



exports.create = async (req, res) => {
  try {
    const {supplier_shipment_id,product_id,quantity,unit_cost,total,quantity_paid,date_received,total_cost,paid}=req.body;
    const supplier_shipment=await Supplier_shipment.findByPk(supplier_shipment_id);
    if(!supplier_shipment)res.status(400).json({error:"SUPPLiER WAS NOT FOUND PLease retry"});
    const product=await Product.findByPk(product_id);
    if(!product)res.status(400).json({error:"PRODUCT WAS NOT FOUND PLease retry"});


    const supplier_shipment_detail = await Supplier.create(
        {
            
            supplier_shipment_id,
            product_id,
            quantity,
            unit_cost,
            total,
            quantity_paid,
            quantity,
            date_received,
            total_cost,
            paid
        }
    );
    if(!supplier_shipment_detail)res.status(401).json({error:"retry again please"});

    res.status(201).json(supplier_shipment_detail);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const supplier_shipment_detail = await Supplier.findAll();
    res.status(200).json(supplier_shipment_detail);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const {id}=req.body;
    const supplier_shipment_detail = await Supplier_shipment_detail.findByPk(id);
    if (!supplier_shipment_detail) return res.status(404).json({ error: "Not found" });
    res.json(supplier_shipment_detail);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const {id}=req.body;

    let {supplier_shipment_id,product_id,quantity,unit_cost,total,quantity_paid,date_received,total_cost,paid}=req.body;
    const supplier_shipment_detail=await Supplier_shipment_detail.findByPk(id);
    if(!supplier_shipment_detail)res.status(400).json({error:"NOT FOUND"});
    const supplier_shipment=await Supplier_shipment.findByPk(supplier_shipment_id);
    if(!supplier_shipment)res.status(400).json({error:"NOT FOUNT SUPPLIER SHIPMENT"});
    const product = await Product.findByPk(product_id);
    if(!product)res.status(400).json({error:"NOT FOUND PRODUCT"});

   if(!quantity)quantity=supplier_shipment_detail.quantity;
   if(!unit_cost)unit_cost=supplier_shipment_detail.unit_cost;
   if(!total)total=supplier_shipment_detail.total;
   if(!quantity_paid)quantity_paid=supplier_shipment_detail.quantity_paid;
   if(!date_received)date_received=supplier_shipment_detail.date_received;
   if(!total_cost)total_cost=supplier_shipment_detail.total_cost;
   if(!paid)paid=supplier_shipment_detail.paid;


    const [updated] = await Supplier_shipment_detail.update({
        supplier_shipment_id,
        product_id,
        quantity,
        unit_cost,
        total_cost,
        total,
        quantity_paid,
        date_received,
        total_cost,
        paid
    }, {
      where: { id:id },
    });
    if (!updated) return res.status(404).json({ error: "Not found" });
    const updatedDetail = await Supplier_shipment_detail.findByPk(id);

    res.json(updatedDetail);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const {id}=req.query;
    const deleted = await Supplier_shipment_detail.destroy({ where: { id: id } });
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ✅ Order map
const orderMap = {
  "date_received-asc": [["date_received", "ASC"]],
  "date_received-desc": [["date_received", "DESC"]],
  "paid-asc": [["paid", "ASC"]],
  "paid-desc": [["paid", "DESC"]],
  "total_cost-asc": [["total_cost", "ASC"]],
  "total_cost-desc": [["total_cost", "DESC"]],
  "createdAt-asc": [["createdAt", "ASC"]],
  "createdAt-desc": [["createdAt", "DESC"]],
  "updatedAt-asc": [["updatedAt", "ASC"]],
  "updatedAt-desc": [["updatedAt", "DESC"]],
  "supplier_shipment_id-asc":[["supplier_shipment_id",'ASC']],
  "supplier_shipment_id-desc":[["supplier_shipment_id",'DESC']],
  "product_id-asc":[["product_id","ASC"]],
  "product_id-desc":[["product_id","DESC"]],
  "quantity-asc":[["quantity","ASC"]],
  "quantity-desc":[["quantity","DESC"]],
  "currency-asc":[["currency","ASC"]],
  "currency-desc":[["currency","DESC"]],
  "product_id-asc":[["product_id",'ASC']],
  "product_id-desc":[["product_id",'DESC']],
  "id-asc":[["id",'ASC']],
  "id-desc":[["id",'DESC']],
  "unit_cost-asc":[["unit_cost",'ASC']],
  "unit_cost-desc":[["unit_cost",'DESC']],
  "unit_cost-desc":[["unit_cost",'DESC']],  
};

// 1. Get all shipment details
exports.getShipmentDetails = async (req, res) => {
  try {
    let { page = 1, limit = 10, orderBy = "date_received-desc" } = req.body;

    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;
    const order = orderMap[orderBy] || [["createdAt", "DESC"]];

    const { count, rows } = await Supplier_shipment_detail.findAndCountAll({
      include: [
        { model: Supplier_shipment, as: "shipment",attributes:["id"], include: [{ model: Supplier ,attributes:["uuid","name"]}] },
        { model: Product, as: "product" ,attributes:["category_id","user_id","title"],include:[{model:Product_image, attributes:["filename"],where:{image_type:"main"}}]},
      ],
      attributes:["id","product_id","total_cost","paid","currency","quantity"],
      order,
      limit,
      offset,
      nest:true,
      raw:true
    });

    return res.status(200).json({
      succes: true,
      total: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      details: rows,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.searchinDetails = async (req, res) => {
  try {
    
    let {
      page = 1,
      limit = 10,
      orderBy = "date_received-desc",
      supplier_id,
      supplier_shipment_id,
      product_id,
      id,
      quantity,
      quantity_condition,
      unit_cost,
      unit_cost_condition,
      total,
      total_condition,
      quantity_paid,
      quantity_paid_condition,
      date_received,
      date_received_condition,
      total_cost,
      total_cost_condition,
      paid,
      paid_condition,
    } = req.body;

    // pagination
    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;
    const order = orderMap[orderBy] || [["date_received", "DESC"]];

    const where = {};

    if (id) where.id = id;
    if (product_id) where.product_id = product_id;
    if (supplier_shipment_id) where.supplier_shipment_id = supplier_shipment_id;

    // Filters with conditions
    const applyCondition = (field, value, condition) => {
      if (!value) return;
      if (condition === "lower") where[field] = { [Op.lt]: value };
      else if (condition === "bigger") where[field] = { [Op.gt]: value };
      else where[field] = { [Op.eq]: value };
    };

    applyCondition("quantity", quantity, quantity_condition);
    applyCondition("unit_cost", unit_cost, unit_cost_condition);
    applyCondition("total", total, total_condition);
    applyCondition("quantity_paid", quantity_paid, quantity_paid_condition);
    applyCondition("date_received", date_received, date_received_condition);
    applyCondition("total_cost", total_cost, total_cost_condition);
    applyCondition("paid", paid, paid_condition);

    const { count, rows } = await Supplier_shipment_detail.findAndCountAll({
      where,
      include: [
        {
          model: Supplier_shipment,
          as: "shipment",
          attributes:["id"],
          ...(supplier_id && { where: { supplier_id } }),
        },
        { model: Product, as: "product" ,attributes:["category_id","user_id","title"],include:[{model:Product_image, attributes:["filename"],where:{image_type:"main"}}]},      ],
      order,
      limit,
      offset,
    });

    return res.status(200).json({
      succes: true,
      total: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      details: rows,
    });

  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.updateShipmentDetail = async (req, res) => {
  try {
    const {id}=req.body
    let {  supplier_shipment_id, product_id, quantity, unit_cost, total, quantity_paid, date_received, total_cost, paid,currency } = req.body;

    const detail = await Supplier_shipment_detail.findByPk(id);
    if (!detail) return res.status(404).json({ message: "Shipment detail not found" });

    if (supplier_shipment_id !== undefined) detail.supplier_shipment_id = supplier_shipment_id;
    if (product_id !== undefined) detail.product_id = product_id;
    if (quantity !== undefined) detail.quantity = quantity;
    if (total !== undefined) detail.total = total;
    if (quantity_paid !== undefined) detail.quantity_paid = quantity_paid;
    if (date_received !== undefined) detail.date_received = date_received;
    if (paid !== undefined) detail.paid = paid;
    if (currency!==undefined) detail.currency=currency
    
    if (quantity && unit_cost && !total_cost) detail.total_cost = quantity * unit_cost;
    else if (quantity && total_cost && !unit_cost) {detail.unit_cost = total_cost / quantity;}else{if(unit_cost && total_cost){detail.total_cost=total_cost;detail.unit_cost=unit_cost}}

    await detail.save();


    return res.status(200).json({
      succes: true,
      message: "Shipment detail updated successfully",
      detail,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};


exports.getDetailsByShipment = async (req, res) => {
  try {
    let { shipment_id, page = 1, limit = 10, orderBy = "date_received-desc" } = req.body;

    if (!shipment_id) return res.status(400).json({ message: "shipment_id is required" });

    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;
    const order = orderMap[orderBy] || [["date_received", "DESC"]];

    const { count, rows } = await Supplier_shipment_detail.findAndCountAll({
      where: { supplier_shipment_id: shipment_id },
      include:[{ model: Product, as: "Product" ,attributes:["category_id","user_id","title"],include:[{model:Product_image, attributes:["filename"],where:{image_type:"main"}}]},],
      order,
      limit,
      offset,
    });

    return res.status(200).json({
      succes: true,
      total: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      details: rows,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};


exports.getDetailsBySupplier = async (req, res) => {
  try {
    let { supplier_id, page = 1, limit = 10, orderBy = "date_received-desc" } = req.body;

    if (!supplier_id) return res.status(400).json({ message: "supplier_id is required" });

    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;
    const order = orderMap[orderBy] || [["date_received", "DESC"]];

    const { count, rows } = await Supplier_shipment_detail.findAndCountAll({
      include: [
        {
          model: Supplier_shipment,
          as: "shipment",
          attributes:["id"],
          where: { supplier_id },
          include: [{ model: Supplier,attributes:["uuid","name"] }],
        },
        { model: Product, as: "product" ,attributes:["category_id","user_id","title"],include:[{model:Product_image, attributes:["filename"],where:{image_type:"main"}}]},
      ],
      order,
      limit,
      offset,
    });

    return res.status(200).json({
      succes: true,
      total: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      details: rows,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getDetailsByProduct = async (req, res) => {
  try {
    let { product_id, page = 1, limit = 10, orderBy = "date_received-desc" } = req.body;

    if (!product_id) return res.status(400).json({ message: "product_id is required" });

    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;
    const order = orderMap[orderBy] || [["date_received", "DESC"]];

    const { count, rows } = await Supplier_shipment_detail.findAndCountAll({
      where: { product_id },
      include: [
        {
          model: Supplier_shipment,
          as: "shipment",
          attributes:["id"],
          include: [{ model: Supplier, attributes: ["uuid", "name"] }],
        },
        { model: Product, as: "product" ,attributes:["category_id","user_id","title"],include:[{model:Product_image, attributes:["filename"],where:{image_type:"main"}}]},
      ],
      order,
      limit,
      offset,
    });

    return res.status(200).json({
      succes: true,
      total: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      details: rows,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};


// Create a new shipment detail (unit_cost / total_cost smart calculation)
exports.addShipmentDetail = async (req, res) => {
  try {
    const {
      supplier_shipment_id,
      product_id,
      quantity,
      unit_cost,
      total_cost,
      quantity_paid=0,
      paid=0,
      date_received,
      currency="USD"
    } = req.body;

    // ✅ Validate required fields
    if (!supplier_shipment_id) return res.status(400).json({ message: "supplier_shipment_id is required" });
    if (!product_id)return res.status(400).json({error:"product_id is  required"})
    if (!quantity) return res.status(400).json({ message: "quantity is required" });
    if(!unit_cost &&!total_cost) return res.status(400).json({message:"total or unit cost either is required",error:""})
    
    let finalUnitCost = unit_cost || null;
    let finalTotalCost = total_cost || null;

    // ✅ Calculate missing value
    if (quantity && unit_cost && !total_cost) {
      finalTotalCost = quantity * unit_cost;
    } else if (quantity && total_cost && !unit_cost) {
      finalUnitCost = total_cost / quantity;

    }else{if(unit_cost && total_cost){finalTotalCost=total_cost;finalUnitCost=unit_cost}}


    const newDetail = await Supplier_shipment_detail.create({
      supplier_shipment_id,
      product_id: product_id ,
      quantity,
      unit_cost: finalUnitCost,
      total_cost: finalTotalCost,
      quantity_paid,
      paid,
      date_received: date_received || null,
      currency
    },{raw:true});

    return res.status(201).json({
      succes: true,
      message: "Shipment detail created successfully",
      detail: newDetail,
    });
  } catch (err) {
   return res.status(500).json({ message: "Server error", error: err.message });
  }
};



exports.bulkCreateDetails = async (req, res) => {
  try {
    const { details } = req.body; // array of shipment detail objects
    if (!details || !Array.isArray(details) || details.length === 0) {
      return res.status(400).json({ message: "details array is required" });
    }

    // Smart calculation for unit_cost / total_cost per detail
    // const processedDetails = details.map(d => {
    //   const {
    //     supplier_shipment_id,
    //     product_id,
    //     quantity,
    //     unit_cost,
    //     total_cost,
    //     quantity_paid=0,
    //     paid=0,
    //     date_received,
    //     currency="USD"
    //   } = d;
    //   if (!supplier_shipment_id) return null;
    //   if (!product_id)return null;
    //   if (!quantity) return null;
    //   if(!unit_cost &&!total_cost) return null;
    
    //   let finalUnitCost = unit_cost || null;
    //   let finalTotalCost = total_cost || null;

    //   if (quantity && unit_cost && !total_cost) {
    //     finalTotalCost = quantity * unit_cost;
    //   } else if (quantity && total_cost && !unit_cost) {
    //     finalUnitCost = total_cost / quantity;
        
    //   }else{if(total_cost && unit_cost){finalUnitCost=unit_cost;finalTotalCost=total_cost}}

    //   return {
    //     supplier_shipment_id: supplier_shipment_id,
    //     product_id: product_id ,
    //     quantity: quantity,
    //     unit_cost: finalUnitCost,
    //     total_cost: finalTotalCost,
    //     quantity_paid: quantity_paid,
    //     paid: paid,
    //     date_received: date_received |null,
    //     currency:currency,
    //   };
    // });
    const processedDetails = details.map(d => {
  const {
    supplier_shipment_id,
    product_id,
    // قد تَجي كسلاسل، خلينا نحاول نحول للأرقام لما لازم
    quantity,
    unit_cost,
    total_cost,
    quantity_paid = 0,
    paid = 0,
    date_received,
    currency = "USD"
  } = d;

  // validation: لازم نفحص null/undefined وليس falsy
  if (supplier_shipment_id === undefined || supplier_shipment_id === null || supplier_shipment_id === "") return null;
  if (!product_id) return null; // product_id كـ uuid/string => empty string invalid
  // quantity ممكن يكون 0؟ غالباً لا — لو 0 غير مقبول فابقى هالتحقق، وإلا عدّله
  if (quantity === undefined || quantity === null || quantity === "") return null;

  // نحوّل الأعداد بشكل آمن
  const qty = Number(quantity);
  const unit = unit_cost === "" || unit_cost === null || unit_cost === undefined ? null : Number(unit_cost);
  const total = total_cost === "" || total_cost === null || total_cost === undefined ? null : Number(total_cost);

  // إذا كنت تسمح بالقيم 0، ما تستخدم !unit و !total كما قبل
  if ((unit === null || Number.isNaN(unit)) && (total === null || Number.isNaN(total))) {
    // ما في لا unit ولا total -> invalid
    return null;
  }

  // استنتاج واحد من الاخر اذا مفقود
  let finalUnitCost = unit;
  let finalTotalCost = total;

  if (!Number.isNaN(qty) && finalUnitCost !== null && (finalTotalCost === null || Number.isNaN(finalTotalCost))) {
    finalTotalCost = qty * finalUnitCost;
  } else if (!Number.isNaN(qty) && finalTotalCost !== null && (finalUnitCost === null || Number.isNaN(finalUnitCost))) {
    finalUnitCost = finalTotalCost / qty;
  } else if (finalUnitCost !== null && finalTotalCost !== null) {
    // keep as-is
  }

  return {
    supplier_shipment_id: supplier_shipment_id,
    product_id: product_id,
    quantity: qty,
    unit_cost: finalUnitCost,
    total_cost: finalTotalCost,
    quantity_paid: Number(quantity_paid || 0),
    paid: Number(paid || 0),
    date_received: date_received ?? null,
    currency: currency ?? "USD",
    createdAt: new Date(),
    updatedAt: new Date()
  };
});

    const newDetails = await Supplier_shipment_detail.bulkCreate(processedDetails);

    return res.status(201).json({
      succes: true,
      message: "Shipment details created successfully",
      details: newDetails,
    });
  } catch (err) {

    return res.status(500).json({ message: "Server error", error: err.message });
  }
};


// Bulk update shipment details
exports.bulkUpdateDetails = async (req, res) => {
  try {
    const { updates } = req.body; // array of { id, fieldsToUpdate }

    if (!updates || !Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ message: "updates array is required" });
    }

    const results = [];

    for (const u of updates) {
      const detail = await Supplier_shipment_detail.findByPk(u.id);
      if (!detail) continue; // skip if not found

      // Apply updates
      if (u.supplier_shipment_id !== undefined) detail.supplier_shipment_id = u.supplier_shipment_id;
      if (u.product_id !== undefined) detail.product_id = u.product_id;
      if (u.quantity !== undefined) detail.quantity = u.quantity;
      if (u.unit_cost !== undefined) detail.unit_cost = u.unit_cost;
      if (u.total_cost !== undefined) detail.total_cost = u.total_cost;
      if (u.quantity_paid !== undefined) detail.quantity_paid = u.quantity_paid;
      if (u.paid !== undefined) detail.paid = u.paid;
      if (u.date_received !== undefined) detail.date_received = u.date_received;
      if (u.currency !== undefined) detail.currency=u.currency;
      if (u.total !== undefined) detail.total=u.total;
      // Smart calculation if one of unit_cost or total_cost is missing
      if (detail.quantity && detail.unit_cost && !detail.total_cost) detail.total_cost = detail.quantity * detail.unit_cost;
      else if (detail.quantity && detail.total_cost && !detail.unit_cost) detail.unit_cost = detail.total_cost / detail.quantity;else{if(u.unit_cost && u.total_cost){detail.unit_cost=u.unit_cost;detail.total_cost=u.total_cost}}

      await detail.save();
      results.push(detail);
    }

    return res.status(200).json({
      succes: true,
      message: "Shipment details updated successfully",
      updatedDetails: results,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};



// Bulk delete shipment details
exports.bulkDeleteDetails = async (req, res) => {
  try {
    const { ids } = req.body; // array of detail IDs

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "ids array is required" });
    }

    const deletedCount = await Supplier_shipment_detail.destroy({
      where: { id: ids },
    });

    return res.status(200).json({
      succes: true,
      message: `${deletedCount} shipment details deleted successfully`,
    });
  } catch (err) {
    console.error("Error bulk deleting details:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
