const Attribute_type = require('../models/_attribute_types.js');

exports.create = async (req, res) => {
  try {
    const at = await Attribute_type.create(req.body);
    res.status(201).json(at);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const ats = await Attribute_type.findAll();
    res.json(ats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const at = await Attribute_type.findByPk(req.params.id);
    if (!at) return res.status(404).json({ error: "Not found" });
    res.json(at);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const [updated] = await Attribute_type.update(req.body, {
      where: { id: req.params.id },
    });
    if (!updated) return res.status(404).json({ error: "Not found" });
    const updatedAt = await Attribute_type.findByPk(req.params.id);
    res.json(updatedAt);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Attribute_type.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
