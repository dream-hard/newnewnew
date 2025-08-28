const Order = require('../models/_order.js');

exports.create = async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const orders = await Order.findAll();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.uuid);
    if (!order) return res.status(404).json({ error: "Not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const [updated] = await Order.update(req.body, {
      where: { uuid: req.params.uuid },
    });
    if (!updated) return res.status(404).json({ error: "Not found" });
    const updatedOrder = await Order.findByPk(req.params.uuid);
    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Order.destroy({ where: { uuid: req.params.uuid } });
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

