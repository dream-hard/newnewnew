const { Op } = require("sequelize");
const { DB } = require("../config/config");
const Currency = require("../models/_currencies");
const Exchange_rate = require("../models/_exchange_rates");
const { Product } = require("../models");

const orderMap = {
  "currency_iso-asc": [["currency_iso", "ASC"]],
  "currency_iso-desc": [["currency_iso", "DESC"]],
  "name-asc": [["name", "ASC"]],
  "name-desc": [["name", "DESC"]],
  "symbol-asc": [["symbol", "ASC"]],
  "symbol-desc": [["symbol", "DESC"]],
  "createdAt-asc": [["createdAt", "ASC"]],
  "createdAt-desc": [["createdAt", "DESC"]],
  "updatedAt-asc": [["updatedAt", "ASC"]],
  "updatedAt-desc": [["updatedAt", "DESC"]],
};

// currencyController.js

const createCurrency = async (req, res) => {
  try {
    const {iso,name,symbol}=req.body;

    const currency = await Currency.create(
      {
        currency_iso:iso,
        name,
        symbol
      }
    );
    res.status(201).json({succes:true,msg:"the currency has been add succseful"});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllCurrencies = async (req, res) => {
  try {
    const { page=1,limit=10,orderby}=req.body;
    const offset=(page-1)*limit;
    const order=orderMap(orderby) || [["createdAt", "DESC"]];
    const {count,rows} = await Currency.findAndCountAll({raw:true,limit,offset,order});

    res.status(200).json({    
      total: count,
      currentPage:page,
      totalPages: Math.ceil(count / limit),
      currencies: rows,
      succes:true
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCurrencyByIso = async (req, res) => {
  try {
    const {iso}=req.body;
    if(!iso)return res.status(404).json({error:"not found currency by iso"});
    const currency = await Currency.findByPk(iso);
    if (!currency) {
      return res.status(404).json({ error: 'Currency not found' });
    }
    res.json({succes:true,currency:currency});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCurrency = async (req, res) => {
  try {
    let {iso_edit}=req.body;
    const {iso, name,symbol}=req.body;
    if((iso_edit===undefined||iso_edit===null)||(iso_edit==='')){
      iso_edit=iso
    }
    const [updated] = await Currency.update({
      currency_iso:iso_edit,
      name,
      symbol

    }, {
      where: { currency_iso: iso},
    });
    if (!updated) {
      return res.status(404).json({ error: 'Currency not found' });
    }
    const updatedCurrency = await Currency.findByPk(iso_edit);
    res.json({succes:true,msg:"the currency was updated seccafuly"});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCurrency = async (req, res) => {
  try {
    const {iso}=req.body;
    const deleted = await Currency.destroy({
      where: { currency_iso: iso },
    });
    if (!deleted) {
      return res.status(404).json({ error: 'Currency not found' });
    }
    res.status(204).send(); // No content
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCurrencywithouteffect= async(req,res)=>{
  try {
    const { iso}=req.body;
    
    const t= await DB.transaction();
    try {
      await Exchange_rate.update({target_currency_id:'nnn'},{transaction:t,where :{target_currency_id:iso}});
      await Exchange_rate.update({base_currency_id:'nnn'},{transaction:t,where :{base_currency_id:iso}});
      await Product.update({currency_id:"NNN"},{where : { currency_id:iso},transaction:t});

      const deleted=await Currency.destroy({transaction:t,where:{currency_iso:iso}});
      await t.commit();

      res.status(201).json({succes:true,msg:"the currency was deleted without any effect"});

    } catch (error) {
       await t.rollback(); // rollback on error
    res.status(500).json({ message: "Failed to delete currency", error });
      
    }

    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


const searchcurrency=async  (req,res)=>{
  try {
    const {iso,name ,symbol,page=1,limit=10,orderby}=req.body;
    let where={};
    const offset=(page-1)*limit;
    if(iso)where.currency_iso={[Op.like]:`%${iso}%`}
    if(name)where.name={[Op.like]:`%${name}%`}
    if(symbol)where.symbol={[Op.like]:`%${symbol}%`}
    let order= orderMap[orderby] || orderMap["date-desc"];

    const {count , rows}=await Currency.findAndCountAll({order,offset,limit,where,raw:true});

    res.status(200).json({
      total: count,
      currentPage:page,
      totalPages: Math.ceil(count / limit),
      currencies: rows,
      succes:true
      
    })
    
  } catch (error) {
        res.status(500).json({ error: error.message });

    
  }
}

const justgetall=async(req,res)=>{
  try {
    const currencies=await Currency.findAll({attributes:["currency_iso","name","symbol"],raw:true });

    res.status(200).json (currencies);
  } catch (error) {
     res.status(500).json({ error: error.message });

  }
}

module.exports = {
  justgetall,
  searchcurrency,
  deleteCurrencywithouteffect,
  createCurrency,
  getAllCurrencies,
  getCurrencyByIso,
  updateCurrency,
  deleteCurrency,
};

