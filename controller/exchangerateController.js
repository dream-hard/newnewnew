const { Op } = require("sequelize");
const Exchange_rate = require("../models/_exchange_rates");
const { DB } = require("../config/config");

const orderMap = {
  "date-asc": [["dateofstart", "ASC"]],
  "date-desc": [["dateofstart", "DESC"]],
  "rate-asc": [["exchange_rate", "ASC"]],
  "rate-desc": [["exchange_rate", "DESC"]],
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
    res.status(201).json(response);
  } catch (error) {
  console.error(error);
  if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({ error: error.message });
  }
  res.status(500).json({ error: 'Internal server error' });
}
};

exports.getAll = async (req, res) => {
  try {
    const {page=1,limit=10,orderby}=req.body;
    page=parseInt(page);
    limit=parseInt(limit);

    const offset=(page-1)*limit;
    let order=orderMap[orderby]|| orderMap["createdAt-desc"];

    const {count,rows} = await Exchange_rate.findAndCountAll({limit:limit,offset:offset,order,});
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
    const rate = await Exchange_rate.findOne({
      where: {
        base_currency_id: base,
        target_currency_id: target,
        dateofstart
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
    let {target_edit,base_edit,dateofstart}=req.body;
    const {base,target,rate}=req.body;
    if(((base_edit===undefined||base_edit===null)||(base_edit==="")))
       {base_edit=base}
      if(((target_edit===undefined||target_edit===null)||(target_edit==="")))
      {target_edit=target}


      const [updated] = await Exchange_rate.update(
      {
        base_currency_id:base_edit,
        target_currency_id:target_edit,
        exchange_rate:rate,
        dateofstart

      }, {
      where: {
        base_currency_id: base,
        target_currency_id: target,
        dateofstart:dateofstart
      },
    });
    if (!updated) return res.status(404).json({ error: "Not found" });
    const updatedRate = await Exchange_rate.findOne({
      where: {
        base_currency_id: base_edit,
        target_currency_id: target_edit,
        dateofstart
      },
    });
    res.json(updatedRate);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const {base,target,dateofstart}=req.body;

    const deleted = await Exchange_rate.destroy({
      where: {
        base_currency_id: base,
        target_currency_id: target,
        dateofstart
      },
    });
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getrate = async(req,res)=>{
  try {
    let date;
    const {base,target,amount,dateofstart}=req.body;
    if(!dateofstart || dateofstart===""){
          const today = new Date().toISOString().split('T')[0];
        date=today}
        else{
          date=dateofstart;
        }

    const rate=await Exchange_rate.findOne({where:{     
      base_currency_id:base,
      target_currency_id:target,
      dateofstart: { [Op.lte]: date }
    },
    order:[["dateofstart","DESC"]]
    ,raw:true
    });

    if(!rate)return res.status(404).json({err:"not found"});
    const num=amount*rate.exchange_rate;

    return res.status(200).json({
      result: num,
      rate: rate.exchange_rate,
      dateUsed: rate.dateofstart});

  } catch (error) {
        res.status(500).json({ error: error.message });

  }
}

exports.getjustrate = async(req,res)=>{
  try {
    let date;
    const {base,target,amount,dateofstart}=req.body;
    if(!dateofstart || dateofstart===""){
          const today = new Date().toISOString().split('T')[0];
        date=today}
        else{
          date=dateofstart;
        }

    const rate=await Exchange_rate.findOne({where:{     
      base_currency_id:base,
      target_currency_id:target,
      dateofstart: { [Op.lte]: date }
    },
    order:[["dateofstart","DESC"]]
    ,raw:true
    });

    if(!rate)return res.status(404).json({err:"not found"});

    return res.status(200).json({
      succes:true,
      rate: rate.exchange_rate,
      dateUsed: rate.dateofstart});

  } catch (error) {
        res.status(500).json({ error: error.message });

  }
}


exports.addRate = async (req, res) => {
  const { base, target, rate, date } = req.body;



  try {

    const direct = await Exchange_rate.create({
      base_currency_id: base,
      target_currency_id: target,
      exchange_rate: rate,
      dateofstart: date,
    });

    // Reverse rate = 1/rate
    const reverse = await Exchange_rate.create({
      base_currency_id: target,
      target_currency_id: base,
      exchange_rate: (1 / rate).toFixed(4), // keep more precision if needed
      dateofstart: date,
    });

    res.json({succes:true, message: "Exchange rate added successfully", direct, reverse });
  } catch (err) {
    res.status(500).json({ error: "Failed to add exchange rate" });
  }
};


exports.updateRate = async (req, res) => {
  const {base_edit,target_edit, base, target, rate, date } = req.body;

  if(!base_edit || base_edit===""){
    base_edit=base;
  }
  if(!target_edit || target_edit===""){
    target_edit=target;
  }
  const t = await DB.transaction();
  try {
    // Update direct
    const [updated] = await Exchange_rate.update(
      { base_currency_id:base_edit,target_currency_id:target_edit,exchange_rate: rate, dateofstart: date },
      { where: { base_currency_id: base, target_currency_id: target },transaction:t }
    );

    // Update reverse
    const [updatedReverse] = await Exchange_rate.update(
      { base_currency_id:target_edit,target_currency_id:base_edit,exchange_rate: (1 / rate).toFixed(4), dateofstart: date },

      { where: { base_currency_id: target, target_currency_id: base },transaction:t }
    );
    await t.commit();
    res.json({
      succes:true,
      msg: "Exchange rate updated successfully",
      updated: !!updated,
      updatedReverse: !!updatedReverse,
    });
  } catch (err) {
    await t.rollback()
    res.status(500).json({ error: "Failed to update exchange rate" });
  }
};


exports.searchRates = async (req, res) => {
  const { base, target, date,dateDir,rate,rateDir, search, orderby = "date-desc", page = 1, limit = 10 } = req.body;
  limit=parseInt(limit);
  page=parseInt(page);
  const where = {};
  const offset=(page-1)*limit;
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

  if (search) {
    where[Op.or] = [
      { base_currency_id: { [Op.like]: `%${search}%` } },
      { target_currency_id: { [Op.like]: `%${search}%` } },
    ];
  }

  let order=orderMap[orderby] ||orderMap["date-desc"];

  try {
    const {count,rows} = await Exchange_rate.findAndCountAll({
      where,
      include: [
        { model: Currency, as: "baseCurrency", attributes: ["currency_iso"] },
        { model: Currency, as: "targetCurrency", attributes: ["currency_iso"] },
      ],
      order,
      limit: limit,
      offset:offset,
    });

     res.status(200).json({
      succes:true
      ,suppliers:rows
      ,total:Array.isArray(count) ? count.length : count
      ,currentPage:Number(page)
      ,totalPages:Math.ceil((Array.isArray(count) ? count.length : count) / limit)});  

  } catch (err) {
    res.status(500).json({ error: "Failed to search exchange rates" });
  }
};