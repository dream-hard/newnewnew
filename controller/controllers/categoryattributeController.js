const Category_attribute = require('../models/_category_attribute.js');

exports.create = async (req, res) => {
  try {
    const ca = await Category_attribute.create(req.body);
    res.status(201).json(ca);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const cas = await Category_attribute.findAll();
    res.json(cas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const ca = await Category_attribute.findByPk(req.params.id);
    if (!ca) return res.status(404).json({ error: "Not found" });
    res.json(ca);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const [updated] = await Category_attribute.update(req.body, {
      where: { id: req.params.id },
    });
    if (!updated) return res.status(404).json({ error: "Not found" });
    const updatedCa = await Category_attribute.findByPk(req.params.id);
    res.json(updatedCa);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Category_attribute.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
