const { Product } = require("../models");
const UsedDetails = require("../models/used_details");

    
    const orderMap = {
      "createdAt-asc": [["createdAt", "ASC"]],
      "createdAt-desc": [["createdAt", "DESC"]],
      "id-asc": [["id", "ASC"]],
      "id-desc": [["id", "DESC"]],
      "usage-asc": [["usage_duration", "ASC"]],
      "usage-desc": [["usage_duration", "DESC"]],
      "product_id-asc": [["product_id", "ASC"]],
      "product_id-desc": [["product_id", "DESC"]],
    };
// Create
exports.create = async (req, res) => {
  try {
    const {
      usageDuration,       // maps -> usage_duration
      defects,
      accessoriesIncluded, // maps -> accessories_included
      customization,
      productId            // maps -> product_id (UUID)
    } = req.body;

    if (!productId) return res.status(400).json({ error: "productId is required" });

    const used = await UsedDetails.create({
      usage_duration: usageDuration,
      defects,
      accessories_included: accessoriesIncluded,
      customization,
      product_id: productId
    });

    if (!used) return res.status(400).json({ error: "Could not create used detail, retry." });

    res.status(201).json(used);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all
exports.getAll = async (req, res) => {
  try {
    const rows = await UsedDetails.findAll();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get by PK id
exports.getById = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: "id is required" });

    const row = await UsedDetails.findByPk(id);
    if (!row) return res.status(404).json({ error: "Not found" });

    res.json(row);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get by product_id
exports.getByProductId = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ error: "productId is required" });

    const rows = await UsedDetails.findOne({ where: { product_id: productId } });
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update (must provide id)
exports.update = async (req, res) => {
  try {
    let {
      id,
      usageDuration,
      defects,
      accessoriesIncluded,
      customization,
      productId
    } = req.body;

    if (!id) return res.status(400).json({ error: "id is required for update" });

    const detail = await UsedDetails.findByPk(id);
    if (!detail) return res.status(404).json({ error: "Not found" });

    if (usageDuration === undefined) usageDuration = detail.usage_duration;
    if (defects === undefined) defects = detail.defects;
    if (accessoriesIncluded === undefined) accessoriesIncluded = detail.accessories_included;
    if (customization === undefined) customization = detail.customization;
    if (productId === undefined) productId = detail.product_id;

    await detail.update({
      usage_duration: usageDuration,
      defects,
      accessories_included: accessoriesIncluded,
      customization,
      product_id: productId
    });

    const updated = await UsedDetails.findByPk(id);
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete
exports.delete = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: "id is required" });

    const deleted = await UsedDetails.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ error: "Not found" });

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add to controllers/usedDetailsController.js
exports.getUsedDetailsList = async (req, res) => {
  try {
    const { orderBy, limit = 10, page = 1 } = req.body;
    const offset = (Number(page) - 1) * Number(limit);

    let order = [["createdAt", "DESC"]];



    if (orderBy && orderMap[orderBy]) order = orderMap[orderBy];

    const { count, rows } = await UsedDetails.findAndCountAll({
      attributes: ["id", "usage_duration", "defects", "accessories_included", "customization", "product_id", "createdAt"],
      raw: true,
      order,
      limit: Number(limit),
      offset,
    });

    res.status(200).json({
      success: true,
      usedDetails: rows,
      total: Number(count),
      currentPage: Number(page),
      totalPages: Math.ceil(Number(count) / Number(limit)),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.searchUsedDetails = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      orderBy = "createdAt-desc",

      // filters
      id,
      product_id,
      usage_duration,         // will use like search
      accessories_included,   // text -> like
      customization,          // text -> like
      // For defects (JSON) best you pass a string to match inside JSON (Postgres -> JSON functions required)
      defects_contains,       // string to search inside defects JSON (best-effort using LIKE on raw JSON string if DB supports)
    } = req.body;

    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;

    const order = orderMap[orderBy] || [["createdAt", "DESC"]];

    const where = {};
    if (id) where.id = id;
    if (product_id) where.product_id = product_id;
    if (usage_duration) where.usage_duration = { [Op.like]: `%${usage_duration}%` };
    if (accessories_included) where.accessories_included = { [Op.like]: `%${accessories_included}%` };
    if (customization) where.customization = { [Op.like]: `%${customization}%` };

    // defects_contains: best-effort - works if dialect returns JSON as text in findAndCountAll (may vary by DB)
    if (defects_contains) {
      // fallback to TEXT search on JSON string
      where.defects = { [Op.like]: `%${defects_contains}%` };
    }

    const { count, rows } = await UsedDetails.findAndCountAll({
      where,
      include: [{ model: Product, attributes: ["uuid", "name"], required: false }],
      order,
      limit,
      offset,
      raw: false,
    });

    return res.status(200).json({
      total: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      usedDetails: rows,
      succes: true,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};


exports.filterUsedDetails = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      orderBy = "createdAt-desc",

      id,
      product_id,
      usage_duration,
      accessories_included,
      customization,
      defects, // JSON exact match (depends on DB)
    } = req.body;

    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;


    const order = orderMap[orderBy] || [["createdAt", "DESC"]];

    const where = {};
    if (id) where.id = { [Op.eq]: id };
    if (product_id) where.product_id = { [Op.eq]: product_id };
    if (usage_duration !== undefined && usage_duration !== "") where.usage_duration = { [Op.eq]: usage_duration };
    if (accessories_included !== undefined && accessories_included !== "") where.accessories_included = { [Op.eq]: accessories_included };
    if (customization !== undefined && customization !== "") where.customization = { [Op.eq]: customization };
    if (defects !== undefined && defects !== "") where.defects = { [Op.eq]: defects }; // exact JSON/value match

    const { count, rows } = await UsedDetails.findAndCountAll({
      where,
      include: [{ model: Product, attributes: ["uuid", "name"], required: false }],
      order,
      limit,
      offset,
      raw: false,
    });

    return res.status(200).json({
      total: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      usedDetails: rows,
      succes: true,
    });
  } catch (err) {
    console.error("Error searching UsedDetails:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
