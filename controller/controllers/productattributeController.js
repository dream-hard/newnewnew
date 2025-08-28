const Product_attribute = require('../models/_product_attribute.js');

exports.create = async (req, res) => {
  try {
    const pa = await Product_attribute.create(req.body);
    res.status(201).json(pa);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const pas = await Product_attribute.findAll();
    res.json(pas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const pa = await Product_attribute.findByPk(req.params.id);
    if (!pa) return res.status(404).json({ error: "Not found" });
    res.json(pa);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const [updated] = await Product_attribute.update(req.body, {
      where: { id: req.params.id },
    });
    if (!updated) return res.status(404).json({ error: "Not found" });
    const updatedPa = await Product_attribute.findByPk(req.params.id);
    res.json(updatedPa);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Product_attribute.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
