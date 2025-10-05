const { Product } = require("../models");
const CourseDetails = require("../models/course_details");


    // orderMap
    const orderMap = {
      "start_date-asc": [["start_date", "ASC"]],
      "start_date-desc": [["start_date", "DESC"]],
      "end_date-asc": [["end_date", "ASC"]],
      "end_date-desc": [["end_date", "DESC"]],
      "id-asc": [["id", "ASC"]],
      "id-desc": [["id", "DESC"]],
      "duration-asc": [["duration", "ASC"]],
      "duration-desc": [["duration", "DESC"]],
      "level-asc": [["level", "ASC"]],
      "level-desc": [["level", "DESC"]],
      "instructor-asc": [["instructor", "ASC"]],
      "instructor-desc": [["instructor", "DESC"]],
      "product_id-asc": [["product_id", "ASC"]],
      "product_id-desc": [["product_id", "DESC"]],
      "createdAt-asc": [["createdAt", "ASC"]],
      "createdAt-desc": [["createdAt", "DESC"]],
    };

// Create
exports.create = async (req, res) => {
  try {
    const {
      duration,
      level,
      language,
      instructor,
      syllabus,
      format,
      startDate,    // maps -> start_date
      endDate,      // maps -> end_date
      certificate = false,
      prerequires,
      platform,
      productId     // maps -> product_id (UUID)
    } = req.body;

    if (!productId) return res.status(400).json({ error: "productId is required" });

    const course = await CourseDetails.create({
      duration,
      level,
      language,
      instructor,
      syllabus,
      format,
      start_date: startDate,
      end_date: endDate,
      certificate,
      prerequires,
      platform,
      product_id: productId
    });

    if (!course) return res.status(400).json({ error: "Could not create course detail, retry." });

    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all
exports.getAll = async (req, res) => {
  try {
    const details = await CourseDetails.findAll();
    res.json(details);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get by PK id
exports.getById = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: "id is required" });

    const detail = await CourseDetails.findByPk(id);
    if (!detail) return res.status(404).json({ error: "Not found" });

    res.json(detail);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get by product_id (UUID)
exports.getByProductId = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ error: "productId is required" });

    const rows = await CourseDetails.findOne({ where: { product_id: productId } });
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
      duration,
      level,
      language,
      instructor,
      syllabus,
      format,
      startDate,
      endDate,
      certificate,
      prerequires,
      platform,
      productId
    } = req.body;

    if (!id) return res.status(400).json({ error: "id is required for update" });

    const detail = await CourseDetails.findByPk(id);
    if (!detail) return res.status(404).json({ error: "Not found" });

    // keep existing values when not provided
    if (duration === undefined) duration = detail.duration;
    if (level === undefined) level = detail.level;
    if (language === undefined) language = detail.language;
    if (instructor === undefined) instructor = detail.instructor;
    if (syllabus === undefined) syllabus = detail.syllabus;
    if (format === undefined) format = detail.format;
    if (startDate === undefined) startDate = detail.start_date;
    if (endDate === undefined) endDate = detail.end_date;
    if (certificate === undefined) certificate = detail.certificate;
    if (prerequires === undefined) prerequires = detail.prerequires;
    if (platform === undefined) platform = detail.platform;
    if (productId === undefined) productId = detail.product_id;

    await detail.update({
      duration,
      level,
      language,
      instructor,
      syllabus,
      format,
      start_date: startDate,
      end_date: endDate,
      certificate,
      prerequires,
      platform,
      product_id: productId
    });

    const updated = await CourseDetails.findByPk(id);
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

    const deleted = await CourseDetails.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ error: "Not found" });

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Add to controllers/courseDetailsController.js
exports.getCourseDetailsList = async (req, res) => {
  try {
    const { orderBy, limit = 10, page = 1 } = req.body;
    const offset = (Number(page) - 1) * Number(limit);

    // default order
    let order = [["createdAt", "DESC"]];

    // Mapping query values → Sequelize order format

    if (orderBy && orderMap[orderBy]) order = orderMap[orderBy];

    const { count, rows } = await CourseDetails.findAndCountAll({
      attributes: ["id", "duration", "level", "language", "instructor", "start_date", "end_date", "certificate", "product_id", "createdAt"],
      raw: true,
      order,
      limit: Number(limit),
      offset,
    });

    res.status(200).json({
      success: true,
      courseDetails: rows,
      total: Number(count),
      currentPage: Number(page),
      totalPages: Math.ceil(Number(count) / Number(limit)),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};



exports.searchCourseDetails = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      orderBy = "start_date-desc",

      // filters
      id,
      product_id,
      duration,
      level,
      language,
      instructor,
      certificate,            // boolean or string 'true'/'false'
      start_date,
      start_date_condition,   // lower / bigger / equal
      end_date,
      end_date_condition,     // lower / bigger / equal
      platform,
    } = req.body;

    // pagination
    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;


    const order = orderMap[orderBy] || [["start_date", "DESC"]];

    // where
    let where = {};
    if (id) where.id = id;
    if (product_id) where.product_id = product_id;
    if (duration) where.duration = { [Op.like]: `%${duration}%` };
    if (level) where.level = { [Op.like]: `%${level}%` };
    if (language) where.language = { [Op.like]: `%${language}%` };
    if (instructor) where.instructor = { [Op.like]: `%${instructor}%` };
    if (platform) where.platform = { [Op.like]: `%${platform}%` };
    if (certificate !== undefined && certificate !== null && certificate !== "") {
      // accept boolean or string
      if (typeof certificate === "string") certificate = certificate === "true";
      where.certificate = certificate;
    }

    // start_date filter
    if (start_date) {
      if (start_date_condition === "lower") where.start_date = { [Op.lt]: start_date };
      else if (start_date_condition === "bigger") where.start_date = { [Op.gt]: start_date };
      else where.start_date = { [Op.eq]: start_date };
    }

    // end_date filter
    if (end_date) {
      if (end_date_condition === "lower") where.end_date = { [Op.lt]: end_date };
      else if (end_date_condition === "bigger") where.end_date = { [Op.gt]: end_date };
      else where.end_date = { [Op.eq]: end_date };
    }

    const { count, rows } = await CourseDetails.findAndCountAll({
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
      courseDetails: rows,
      succes: true,
    });
  } catch (err) {
    console.error("Error searching CourseDetails:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};




exports.filterCourseDetails = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      orderBy = "start_date-desc",

      id,
      product_id,
      duration,
      level,
      language,
      instructor,
      certificate,    // boolean or "true"/"false"
      start_date,
      end_date,
      platform,
    } = req.body;

    // pagination
    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;

    // order map
    
    const order = orderMap[orderBy] || [["start_date", "DESC"]];

    // where using ONLY equality (Op.eq)
    const where = {};
    if (id) where.id = { [Op.eq]: id };
    if (product_id) where.product_id = { [Op.eq]: product_id };
    if (duration !== undefined && duration !== "") where.duration = { [Op.eq]: duration };
    if (level !== undefined && level !== "") where.level = { [Op.eq]: level };
    if (language !== undefined && language !== "") where.language = { [Op.eq]: language };
    if (instructor !== undefined && instructor !== "") where.instructor = { [Op.eq]: instructor };
    if (platform !== undefined && platform !== "") where.platform = { [Op.eq]: platform };

    if (certificate !== undefined && certificate !== null && certificate !== "") {
      if (typeof certificate === "string") certificate = certificate === "true";
      where.certificate = { [Op.eq]: certificate };
    }

    if (start_date) where.start_date = { [Op.eq]: start_date };
    if (end_date) where.end_date = { [Op.eq]: end_date };

    const { count, rows } = await CourseDetails.findAndCountAll({
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
      courseDetails: rows,
      succes: true,
    });
  } catch (err) {
    console.error("Error searching CourseDetails:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

