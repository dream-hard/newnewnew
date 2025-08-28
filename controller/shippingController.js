const { Op } = require('sequelize');
const { Shipping_method, Shipping, Order } = require('../models');

function generateTrackingNumber(order) {
  const prefix = 'ORD';

  // Format date as YYYYMMDD
  const date = new Date(order.order_date || Date.now());
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 0-based month
  const day = String(date.getDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`;

  // Use first 6 characters of UUID (or you can use numeric id)
  const shortId = order.uuid ? order.uuid.replace(/-/g, '').slice(0, 6).toUpperCase() : Math.random().toString(36).substr(2, 6).toUpperCase();

  return `${prefix}-${dateStr}-${shortId}`;
}


exports.create = async (req, res) => {
  try {
    const {name,order_id,note,shipping_method_id,shipping_date,delivered_date}=req.body;
    const order =await Order.findByPk(order_id);
    const method=await Shipping_method.findByPk(shipping_method_id);
    const tracknumber=generateTrackingNumber(order);



    const shipping = await Shipping.create(
        {
            name,
            cost ,
            type:method.id,
            cost :method.cost,
            tracknumber:tracknumber,
            shipping_date:shipping_date,
            dlivered_date:delivered_date,
            note
        }
    );
    res.status(201).json(shipping);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const methods = await Shipping.findAll();
    res.json(methods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const {id}=req.body;

    const methods = await Shipping.findByPk(id);
    if (!methods) return res.status(404).json({ error: "Not found" });
    res.json(methods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getbyorderid= async (req,res)=>{
    try {
        const {order_id}=req.body;
        const shipping=await Shipping.findOne({where:{order_id:order_id}})

        if(!shipping)return res.status(404).json({error:"Not Found shipping for this Order"});
        res.json(shipping);

    } catch (error) {
            res.status(500).json({ error: error.message });

    }
}

exports.getbyshippingmethod=async (req, res)=>{
    try {
        const {type_id}=req.body;
        const shipping = await Shipping.findAll({where:{type:type_id}})
         if(!shipping)return res.status(404).json({error:"Not Found shipping for this type"});
        res.json(shipping);
    } catch (error) {
            res.status(500).json({ error: error.message });

    }
}
exports.getbytracknumber=async (req,res)=>{
    try {
        const {tracknumber}=req.body;
        const shipping =await Shipping.findOne({where:{tracknumber:tracknumber}});
            if(!shipping)return res.status(404).json({error:"Not Found shipping for this track number "});
        res.json(shipping);
    } catch (error) {
                 res.status(500).json({ error: error.message });

    }
}

exports.update = async (req, res) => {
  try {
    const {id}=req.body;
    let type;
    let{name,cost,tracknumber,type_id,shipping_date,delivered_date,note}=req.body;
    const old=await Shipping.findByPk(id);
    if(!tracknumber)tracknumber=old.tracknumber;
    if(!note)note=old.note;
    if(!shipping_date)shipping_date=old.shipping_date;
    if(!delivered_date)delivered_date=null
    if(!type_id|| type_id===old.type){
        type_id=old.type_id;
        if(!cost)cost=old.cost;

    }else{
        type=await Shipping_method.findByPk(type_id);
        cost =type.cost;

    }
  

    const [updated] = await Shipping_method.update({
        cost:cost,
        tracknumber:tracknumber,
        type:type_id,
        shipping_date:shipping_date,
        dlivered_date:delivered_date,
        note:note
    }, {

      where: { id:id },
    });
    if (!updated) return res.status(404).json({ error: "Not found" });
    const updatedDetail = await Shipping.findByPk(id);
    res.json(updatedDetail);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const {id}=req.body;
    const deleted = await Shipping.destroy({ where: { id: id } });
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




