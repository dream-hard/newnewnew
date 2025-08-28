const Product = require('../models/_products.js');

exports.create = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getByUuid = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.uuid);
    if (!product) return res.status(404).json({ error: "Not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const [updated] = await Product.update(req.body, {
      where: { uuid: req.params.uuid },
    });
    if (!updated) return res.status(404).json({ error: "Not found" });
    const updatedProduct = await Product.findByPk(req.params.uuid);
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Product.destroy({ where: { uuid: req.params.uuid } });
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
