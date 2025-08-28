const Attribute_option = require('../models/_attribute_options.js');

exports.create = async (req, res) => {
  try {
    const ao = await Attribute_option.create(req.body);
    res.status(201).json(ao);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const aos = await Attribute_option.findAll();
    res.json(aos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const ao = await Attribute_option.findByPk(req.params.id);
    if (!ao) return res.status(404).json({ error: "Not found" });
    res.json(ao);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const [updated] = await Attribute_option.update(req.body, {
      where: { id: req.params.id },
    });
    if (!updated) return res.status(404).json({ error: "Not found" });
    const updatedAo = await Attribute_option.findByPk(req.params.id);
    res.json(updatedAo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Attribute_option.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
