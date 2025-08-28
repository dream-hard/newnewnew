// attributeOptionController.js
const AttributeOption = require('../models/_attribute_options.js');

const createAttributeOption = async (req, res) => {
  try {
    const option = await AttributeOption.create(req.body);
    res.status(201).json(option);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllAttributeOptions = async (req, res) => {
  try {
    const options = await AttributeOption.findAll();
    res.json(options);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAttributeOptionById = async (req, res) => {
  try {
    const option = await AttributeOption.findByPk(req.params.id);
    if (!option) return res.status(404).json({ error: 'Attribute option not found' });
    res.json(option);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateAttributeOption = async (req, res) => {
  try {
    const [updated] = await AttributeOption.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: 'Attribute option not found' });
    const updatedOption = await AttributeOption.findByPk(req.params.id);
    res.json(updatedOption);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteAttributeOption = async (req, res) => {
  try {
    const deleted = await AttributeOption.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Attribute option not found' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createAttributeOption,
  getAllAttributeOptions,
  getAttributeOptionById,
  updateAttributeOption,
  deleteAttributeOption,
};
