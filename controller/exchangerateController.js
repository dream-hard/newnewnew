const { Op } = require("sequelize");
const Exchange_rate = require("../models/_exchange_rates");
const Currency = require("../models/_currencies");
const { DB,Sequelize } = require("../config/config");

const orderMap = {
  "dateofstart-asc": [["dateofstart", "ASC"]],
  "dateofstart-desc": [["dateofstart", "DESC"]],
  "exchange_rate-asc": [["exchange_rate", "ASC"]],
  "exchange_rate-desc": [["exchange_rate", "DESC"]],
  "base-asc": [["base_currency_id", "ASC"]],
  "base-desc": [["base_currency_id", "DESC"]],
  "target-asc": [["target_currency_id", "ASC"]],
  "target-desc": [["target_currency_id", "DESC"]],
  "createdAt-asc": [["createdAt", "ASC"]],
  "createdAt-desc": [["createdAt", "DESC"]],
  "updatedAt-asc": [["updatedAt", "ASC"]],
  "updatedAt-desc": [["updatedAt", "DESC"]],
};

exports.create = async (req, res) => {
  try {
    const {base ,target, rate,dateofstart}=req.body;

    const response = await Exchange_rate.create({
      base_currency_id:base,
      target_currency_id:target,
      exchange_rate:rate,
      dateofstart
    });
    res.status(201).json({success:true,rate:response});
  } catch (error) {
  if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({ error: error.message });
  }
  res.status(500).json({ error: 'Internal server error' });
}
};

exports.getAll = async (req, res) => {
  try {
    const {page=1,limit=10,orderby="createdAt-desc"}=req.body;
    page=parseInt(page);
    limit=parseInt(limit);

    const offset=(page-1)*limit;
    let order=orderMap[orderby]|| orderMap["createdAt-desc"];

    const {count,rows} = await Exchange_rate.findAndCountAll({limit:limit,offset:offset,order
        ,include: [
        { model: Currency, as: "baseCurrency", attributes: ["currency_iso", "name", "symbol"] },
        { model: Currency, as: "targetCurrency", attributes: ["currency_iso", "name", "symbol"] }
      ]
    });
    res.status(200).json( {     
      total: count,
      currentPage:page,
      totalPages: Math.ceil(count / limit),
      exchangerates: rows,
      succes:true});
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const {base ,target,dateofstart}=req.body;
    
    const where = { base_currency_id: base, target_currency_id: target };
    if (dateofstart) where.dateofstart = dateofstart;
    const rate = await Exchange_rate.findOne({where });
    if (!rate) return res.status(404).json({ error: "Not found" });
    res.json({success:true,rate});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    // Expect original keys to find row (avoid ambiguity)
    const {
      original_base, original_target, original_date,
      base_currency_id, target_currency_id, exchange_rate, dateofstart
    } = req.body;

    if (!original_base || !original_target) {
      return res.status(400).json({ error: "original_base and original_target required" });
    }

    // Use transaction when changing primary keys (safer)
    const t = await DB.transaction();
    try {
      const [updatedCount] = await Exchange_rate.update({
        base_currency_id: base_currency_id ?? original_base,
        target_currency_id: target_currency_id ?? original_target,
        exchange_rate,
        dateofstart
      }, {
        where: {
          base_currency_id: original_base,
          target_currency_id: original_target,
          ...(original_date ? { dateofstart: original_date } : {})
        },
        transaction: t
      });

      if (!updatedCount) {
        await t.rollback();
        return res.status(404).json({ error: "Not found" });
      }

      await t.commit();

      const updatedRate = await Exchange_rate.findOne({
        where: {
          base_currency_id: base_currency_id ?? original_base,
          target_currency_id: target_currency_id ?? original_target,
          ...(dateofstart ? { dateofstart } : {})
        }
      });

      res.json({ succes: true,msg:"تم تعديل معدل التعديل التحويل بنجاح", rate: updatedRate });
    } catch (err) {
      await t.rollback();
      throw err;
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.delete = async (req, res) => {
  try {
    const { base, target, dateofstart } = req.query;
    
    const where = { base_currency_id: base, target_currency_id: target };
    if (dateofstart!==null || dateofstart!==undefined || dateofstart !=="") where.dateofstart = dateofstart;

    const deleted = await Exchange_rate.destroy({ where });
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ succes: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getrate = async (req, res) => {
  try {
    let { base, target, amount = 1, dateofstart } = req.body;
    const dateUsed = dateofstart && dateofstart !== "" ? dateofstart : new Date().toISOString().split("T")[0];

    const rate = await Exchange_rate.findOne({
      where: {
        base_currency_id: base,
        target_currency_id: target,
        dateofstart: { [Op.lte]: dateUsed }
      },
      order: [["dateofstart", "DESC"]],
      raw: true
    });

    if (!rate) return res.status(404).json({ err: "not found rate " });

    const num = Number(amount) * Number(rate.exchange_rate);

    return res.status(200).json({
      succes: true,
      result: num,
      rate: rate.exchange_rate,
      dateUsed: rate.dateofstart
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getjustrate = async (req, res) => {
  try {
    let { base, target, dateofstart } = req.body;
    const dateUsed = dateofstart && dateofstart !== "" ? dateofstart : new Date().toISOString().split("T")[0];

    const rate = await Exchange_rate.findOne({
      where: {
        base_currency_id: base,
        target_currency_id: target,
        dateofstart: { [Op.lte]: dateUsed }
      },
      order: [["dateofstart", "DESC"]],
      raw: true
    });

    if (!rate) return res.status(404).json({ err: "not found" });

    return res.status(200).json({
      succes: true,
      rate: rate.exchange_rate,
      dateUsed: rate.dateofstart
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getjustratewithrate = async (req, res) => {
  try {
    let { base, target, dateofstart } = req.body;
    const dateUsed = dateofstart && dateofstart !== "" ? dateofstart : new Date().toISOString().split("T")[0];

    const rate = await Exchange_rate.findOne({
      where: {
        base_currency_id: base,
        target_currency_id: target,
        dateofstart: { [Op.lte]: dateUsed }
      },
      order: [["dateofstart", "DESC"]],
      raw: true
    });

    if (!rate) return res.status(404).json({ err: "not found" });

    return res.status(200).json({
      succes: true,
      rate:rate
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.addRate = async (req, res) => {
  const { base, target, rate, date } = req.body;
  const t = await DB.transaction();
  try {
    const direct = await Exchange_rate.create({
      base_currency_id: base,
      target_currency_id: target,
      exchange_rate: rate,
      dateofstart: date,
    }, { transaction: t });

    const reverseRate = (1 / Number(rate)).toFixed(10);
    const reverse = await Exchange_rate.create({
      base_currency_id: target,
      target_currency_id: base,
      exchange_rate: reverseRate,
      dateofstart: date,
    }, { transaction: t });
    
    await t.commit();
    res.json({ succes: true, message: "تم إضافة معدل التحول بنجاح", direct, reverse });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ error: "Failed to add exchange rate", detail: err.message });
  }
};

exports.updateRate = async (req, res) => {
  // updates both directions
  let { base_edit, target_edit, base, target, rate, date } = req.body;
  if (!base_edit || base_edit === "") base_edit = base;
  if (!target_edit || target_edit === "") target_edit = target;

  const t = await DB.transaction();
  try {
    const [updated] = await Exchange_rate.update(
      { base_currency_id: base_edit, target_currency_id: target_edit, exchange_rate: rate, dateofstart: date },
      { where: { base_currency_id: base, target_currency_id: target }, transaction: t }
    );

    const reverseRate = (1 / Number(rate)).toFixed(10);
    const [updatedReverse] = await Exchange_rate.update(
      { base_currency_id: target_edit, target_currency_id: base_edit, exchange_rate: reverseRate, dateofstart: date },
      { where: { base_currency_id: target, target_currency_id: base }, transaction: t }
    );

    await t.commit();
    res.json({ success: true, msg: " تم تعديل معدل التحويل بنجاح", updated: !!updated, updatedReverse: !!updatedReverse });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ error: "Failed to update exchange rate", detail: err.message });
  }
};


exports.searchRates = async (req, res) => {
  let { base, target, date,dateDir,rate,rateDir, search, orderby , page = 1, limit = 10 } = req.body;
  limit=parseInt(limit);
  page=parseInt(page);
  let where = {};
  let offset=(page-1)*limit;
  if (base) where.base_currency_id = {[Op.like]:`%${base}%`};
  if (target) where.target_currency_id = {[Op.like]:`%${target}%`};

  
  // Date filtering
  if (date && dateDir) {
    if (dateDir === "lower") where.dateofstart = { [Op.lt]: date };
    else if (dateDir === "bigger") where.dateofstart = { [Op.gt]: date };
    else if (dateDir === "equal") where.dateofstart = date;
  }

  // Rate filtering
  if (rate && rateDir) {
    if (rateDir === "lower") where.exchange_rate = { [Op.lt]: rate };
    else if (rateDir === "bigger") where.exchange_rate = { [Op.gt]: rate };
    else if (rateDir === "equal") where.exchange_rate = rate;
  }

  if (search!==undefined && search!==null && search) {
    where[Op.or] = [
      { base_currency_id: { [Op.like]: `%${search}%` } },
      { target_currency_id: { [Op.like]: `%${search}%` } },
    ];
  }

  let order=orderMap[orderby] ||orderMap['dateofstart-asc'];

  try {
    const {count,rows} = await Exchange_rate.findAndCountAll({
      where,
      include: [
        { model: Currency, as: "baseCurrency", attributes: ["currency_iso","name"] },
        { model: Currency, as: "targetCurrency", attributes: ["currency_iso",'name'] },
      ],
      order,
      limit: limit,
      offset:offset,
    });

    res.status(200).json({
      succes: true,
      rates: rows,
      total: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit)
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to search exchange rates" });
  }
};

