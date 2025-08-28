const Product_attribute_option = require('../models/_product_attributes');

exports.create = async (req, res) => {
  try {
    const pao = await Product_attribute_option.create(req.body);
    res.status(201).json(pao);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const paos = await Product_attribute_option.findAll();
    res.json(paos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const pao = await Product_attribute_option.findByPk(req.params.id);
    if (!pao) return res.status(404).json({ error: "Not found" });
    res.json(pao);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const [updated] = await Product_attribute_option.update(req.body, {
      where: { id: req.params.id },
    });
    if (!updated) return res.status(404).json({ error: "Not found" });
    const updatedPao = await Product_attribute_option.findByPk(req.params.id);
    res.json(updatedPao);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Product_attribute_option.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
