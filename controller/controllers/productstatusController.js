const Product_statu = require('../models/_product_status.js');

exports.create = async (req, res) => {
  try {
    const statu = await Product_statu.create(req.body);
    res.status(201).json(statu);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const statuses = await Product_statu.findAll();
    res.json(statuses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const statu = await Product_statu.findByPk(req.params.id);
    if (!statu) return res.status(404).json({ error: "Not found" });
    res.json(statu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const [updated] = await Product_statu.update(req.body, {
      where: { id: req.params.id },
    });
    if (!updated) return res.status(404).json({ error: "Not found" });
    const updatedStatu = await Product_statu.findByPk(req.params.id);
    res.json(updatedStatu);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Product_statu.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
