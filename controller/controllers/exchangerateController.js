const Exchange_rate = require('../models/_exchange_rate.js');

exports.create = async (req, res) => {
  try {
    const rate = await Exchange_rate.create(req.body);
    res.status(201).json(rate);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const rates = await Exchange_rate.findAll();
    res.json(rates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const rate = await Exchange_rate.findOne({
      where: {
        base_currency_id: req.params.base_currency_id,
        target_currency_id: req.params.target_currency_id,
      },
    });
    if (!rate) return res.status(404).json({ error: "Not found" });
    res.json(rate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const [updated] = await Exchange_rate.update(req.body, {
      where: {
        base_currency_id: req.params.base_currency_id,
        target_currency_id: req.params.target_currency_id,
      },
    });
    if (!updated) return res.status(404).json({ error: "Not found" });
    const updatedRate = await Exchange_rate.findOne({
      where: {
        base_currency_id: req.params.base_currency_id,
        target_currency_id: req.params.target_currency_id,
      },
    });
    res.json(updatedRate);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Exchange_rate.destroy({
      where: {
        base_currency_id: req.params.base_currency_id,
        target_currency_id: req.params.target_currency_id,
      },
    });
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
