// currencyController.js
const Currency = require('../models/_currencies.js');

const createCurrency = async (req, res) => {
  try {
    const currency = await Currency.create(req.body);
    res.status(201).json(currency);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllCurrencies = async (req, res) => {
  try {
    const currencies = await Currency.findAll();
    res.json(currencies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCurrencyByIso = async (req, res) => {
  try {
    const currency = await Currency.findByPk(req.params.currency_iso);
    if (!currency) {
      return res.status(404).json({ error: 'Currency not found' });
    }
    res.json(currency);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCurrency = async (req, res) => {
  try {
    const [updated] = await Currency.update(req.body, {
      where: { currency_iso: req.params.currency_iso },
    });
    if (!updated) {
      return res.status(404).json({ error: 'Currency not found' });
    }
    const updatedCurrency = await Currency.findByPk(req.params.currency_iso);
    res.json(updatedCurrency);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCurrency = async (req, res) => {
  try {
    const deleted = await Currency.destroy({
      where: { currency_iso: req.params.currency_iso },
    });
    if (!deleted) {
      return res.status(404).json({ error: 'Currency not found' });
    }
    res.status(204).send(); // No content
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createCurrency,
  getAllCurrencies,
  getCurrencyByIso,
  updateCurrency,
  deleteCurrency,
};
