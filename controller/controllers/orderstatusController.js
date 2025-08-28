const Order_statu = require('../models/_order_status.js');

exports.create = async (req, res) => {
  try {
    const status = await Order_statu.create(req.body);
    res.status(201).json(status);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const statuses = await Order_statu.findAll();
    res.json(statuses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const status = await Order_statu.findByPk(req.params.id);
    if (!status) return res.status(404).json({ error: "Not found" });
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const [updated] = await Order_statu.update(req.body, {
      where: { id: req.params.id },
    });
    if (!updated) return res.status(404).json({ error: "Not found" });
    const updatedStatus = await Order_statu.findByPk(req.params.id);
    res.json(updatedStatus);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Order_statu.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
