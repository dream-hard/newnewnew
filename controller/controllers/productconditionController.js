const Product_condition = require('../models/_product_condition.js');

exports.create = async (req, res) => {
  try {
    const condition = await Product_condition.create(req.body);
    res.status(201).json(condition);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const conditions = await Product_condition.findAll();
    res.json(conditions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const condition = await Product_condition.findByPk(req.params.id);
    if (!condition) return res.status(404).json({ error: "Not found" });
    res.json(condition);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const [updated] = await Product_condition.update(req.body, {
      where: { id: req.params.id },
    });
    if (!updated) return res.status(404).json({ error: "Not found" });
    const updatedCondition = await Product_condition.findByPk(req.params.id);
    res.json(updatedCondition);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Product_condition.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
