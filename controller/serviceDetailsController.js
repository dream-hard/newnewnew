const ServiceDetails = require("../models/service_details");

    const orderMap = {
      "createdAt-asc": [["createdAt", "ASC"]],
      "createdAt-desc": [["createdAt", "DESC"]],
      "id-asc": [["id", "ASC"]],
      "id-desc": [["id", "DESC"]],
      "hourly-asc": [["hourly_rate_fee", "ASC"]],
      "hourly-desc": [["hourly_rate_fee", "DESC"]],
      "flat-asc": [["flat_fee", "ASC"]],
      "flat-desc": [["flat_fee", "DESC"]],
      "experiance-asc": [["experiance_year", "ASC"]],
      "experiance-desc": [["experiance_year", "DESC"]],
      "currency-asc": [["currency", "ASC"]],
      "currency-desc": [["currency", "DESC"]],
      "location-asc": [["location", "ASC"]],
      "location-desc": [["location", "DESC"]],
      "product_id-asc": [["product_id", "ASC"]],
      "product_id-desc": [["product_id", "DESC"]],
    };

// Create
exports.create = async (req, res) => {
  try {
    const {
      serviceType,        // maps -> service_type
      location,
      includedTasks,      // maps -> included_tasks
      cancellationPolicy, // maps -> cancellation_policy
      scopeOfWork,        // maps -> scope_of_work
      hourlyRateFee,      // maps -> hourly_rate_fee
      flatFee,            // maps -> flat_fee
      currency = "USD",
      coverageArea,       // maps -> coverage_area
      somthingsRequierd,  // maps -> somthings_requierd (kept your original spelling)
      experianceYear,     // maps -> experiance_year (kept your original spelling)
      productId           // maps -> product_id (UUID)
    } = req.body;

    if (!productId) return res.status(400).json({ error: "productId is required" });

    const service = await ServiceDetails.create({
      service_type: serviceType,
      location,
      included_tasks: includedTasks,
      cancellation_policy: cancellationPolicy,
      scope_of_work: scopeOfWork,
      hourly_rate_fee: hourlyRateFee,
      flat_fee: flatFee,
      currency,
      coverage_area: coverageArea,
      somthings_requierd: somthingsRequierd,
      experiance_year: experianceYear,
      product_id: productId
    });

    if (!service) return res.status(400).json({ error: "Could not create service detail" });

    res.status(201).json(service);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all
exports.getAll = async (req, res) => {
  try {
    const rows = await ServiceDetails.findAll();
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

    const row = await ServiceDetails.findByPk(id);
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

    const rows = await ServiceDetails.findOne({ where: { product_id: productId } });
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
      serviceType,
      location,
      includedTasks,
      cancellationPolicy,
      scopeOfWork,
      hourlyRateFee,
      flatFee,
      currency,
      coverageArea,
      somthingsRequierd,
      experianceYear,
      productId
    } = req.body;

    if (!id) return res.status(400).json({ error: "id is required for update" });

    const detail = await ServiceDetails.findByPk(id);
    if (!detail) return res.status(404).json({ error: "Not found" });

    if (serviceType === undefined) serviceType = detail.service_type;
    if (location === undefined) location = detail.location;
    if (includedTasks === undefined) includedTasks = detail.included_tasks;
    if (cancellationPolicy === undefined) cancellationPolicy = detail.cancellation_policy;
    if (scopeOfWork === undefined) scopeOfWork = detail.scope_of_work;
    if (hourlyRateFee === undefined) hourlyRateFee = detail.hourly_rate_fee;
    if (flatFee === undefined) flatFee = detail.flat_fee;
    if (currency === undefined) currency = detail.currency;
    if (coverageArea === undefined) coverageArea = detail.coverage_area;
    if (somthingsRequierd === undefined) somthingsRequierd = detail.somthings_requierd;
    if (experianceYear === undefined) experianceYear = detail.experiance_year;
    if (productId === undefined) productId = detail.product_id;

    await detail.update({
      service_type: serviceType,
      location,
      included_tasks: includedTasks,
      cancellation_policy: cancellationPolicy,
      scope_of_work: scopeOfWork,
      hourly_rate_fee: hourlyRateFee,
      flat_fee: flatFee,
      currency,
      coverage_area: coverageArea,
      somthings_requierd: somthingsRequierd,
      experiance_year: experianceYear,
      product_id: productId
    });

    const updated = await ServiceDetails.findByPk(id);
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

    const deleted = await ServiceDetails.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ error: "Not found" });

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Add to controllers/serviceDetailsController.js
exports.getServiceDetailsList = async (req, res) => {
  try {
    let { orderBy, limit = 10, page = 1 } = req.body;
    page=parseInt(page);
    limit=parseInt(limit);
    const offset = (Number(page) - 1) * Number(limit);
    let order = [["createdAt", "DESC"]];


    if (orderBy && orderMap[orderBy]) order = orderMap[orderBy];

    const { count, rows } = await ServiceDetails.findAndCountAll({
      attributes: ["id", "service_type", "location", "hourly_rate_fee", "flat_fee", "currency", "coverage_area", "experiance_year", "product_id", "createdAt"],
      raw: true,
      order,
      limit: Number(limit),
      offset,
    });

    res.status(200).json({
      success: true,
      serviceDetails: rows,
      total: Number(count),
      currentPage: Number(page),
      totalPages: Math.ceil(Number(count) / Number(limit)),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


const ServiceDetails = require("../models/_service_details");
const Product = require("../models/_products"); // adjust if needed
const { Op } = require("sequelize");

exports.searchServiceDetails = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      orderBy = "createdAt-desc",

      // filters
      id,
      product_id,
      service_type,
      location,
      coverage_area,
      somthings_requierd,      // text -> like
      currency,
      experiance_year,
      experiance_condition,    // lower / bigger / equal
      hourly_rate_fee,
      hourly_condition,        // lower / bigger / equal
      flat_fee,
      flat_condition,          // lower / bigger / equal
    } = req.body;

    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;


    const order = orderMap[orderBy] || [["createdAt", "DESC"]];

    const where = {};
    if (id) where.id = id;
    if (product_id) where.product_id = product_id;
    if (service_type) where.service_type = { [Op.like]: `%${service_type}%` };
    if (location) where.location = { [Op.like]: `%${location}%` };
    if (coverage_area) where.coverage_area = { [Op.like]: `%${coverage_area}%` };
    if (somthings_requierd) where.somthings_requierd = { [Op.like]: `%${somthings_requierd}%` };
    if (currency) where.currency = currency;

    // experiance_year filter
    if (experiance_year !== undefined && experiance_year !== null && experiance_year !== "") {
      const val = parseInt(experiance_year);
      if (experiance_condition === "lower") where.experiance_year = { [Op.lt]: val };
      else if (experiance_condition === "bigger") where.experiance_year = { [Op.gt]: val };
      else where.experiance_year = { [Op.eq]: val };
    }

    // hourly_rate_fee filter
    if (hourly_rate_fee !== undefined && hourly_rate_fee !== null && hourly_rate_fee !== "") {
      const val = parseFloat(hourly_rate_fee);
      if (hourly_condition === "lower") where.hourly_rate_fee = { [Op.lt]: val };
      else if (hourly_condition === "bigger") where.hourly_rate_fee = { [Op.gt]: val };
      else where.hourly_rate_fee = { [Op.eq]: val };
    }

    // flat_fee filter
    if (flat_fee !== undefined && flat_fee !== null && flat_fee !== "") {
      const val = parseFloat(flat_fee);
      if (flat_condition === "lower") where.flat_fee = { [Op.lt]: val };
      else if (flat_condition === "bigger") where.flat_fee = { [Op.gt]: val };
      else where.flat_fee = { [Op.eq]: val };
    }

    const { count, rows } = await ServiceDetails.findAndCountAll({
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
      serviceDetails: rows,
      succes: true,
    });
  } catch (err) {
    console.error("Error searching ServiceDetails:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};



exports.filterServiceDetails = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      orderBy = "createdAt-desc",

      id,
      product_id,
      service_type,
      location,
      coverage_area,
      somthings_requierd,
      currency,
      experiance_year,
      hourly_rate_fee,
      flat_fee,
    } = req.body;

    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;


    const order = orderMap[orderBy] || [["createdAt", "DESC"]];

    const where = {};
    if (id) where.id = { [Op.eq]: id };
    if (product_id) where.product_id = { [Op.eq]: product_id };
    if (service_type !== undefined && service_type !== "") where.service_type = { [Op.eq]: service_type };
    if (location !== undefined && location !== "") where.location = { [Op.eq]: location };
    if (coverage_area !== undefined && coverage_area !== "") where.coverage_area = { [Op.eq]: coverage_area };
    if (somthings_requierd !== undefined && somthings_requierd !== "") where.somthings_requierd = { [Op.eq]: somthings_requierd };
    if (currency !== undefined && currency !== "") where.currency = { [Op.eq]: currency };

    if (experiance_year !== undefined && experiance_year !== null && experiance_year !== "") {
      where.experiance_year = { [Op.eq]: parseInt(experiance_year) };
    }
    if (hourly_rate_fee !== undefined && hourly_rate_fee !== null && hourly_rate_fee !== "") {
      where.hourly_rate_fee = { [Op.eq]: parseFloat(hourly_rate_fee) };
    }
    if (flat_fee !== undefined && flat_fee !== null && flat_fee !== "") {
      where.flat_fee = { [Op.eq]: parseFloat(flat_fee) };
    }

    const { count, rows } = await ServiceDetails.findAndCountAll({
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
      serviceDetails: rows,
      succes: true,
    });
  } catch (err) {
    console.error("Error searching ServiceDetails:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
