const { Order_detail, Product } = require("../models/index.js");




exports.create = async (req, res) => {
  try {
    const {order,product,note ,softdeleted,quantity}=req.body;
    const _product= await Product.findByPk(product);
    let cost;

    if(_product.discount){
      cost=_product.price
    }else{cost=_product.original_price }
    const detail = await Order_detail.create({
      order_id:order,
      product_id:product,
      note,
      cost_per_one:cost,

    });
    res.status(201).json(detail);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const details = await Order_detail.findAll();
    res.json(details);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const detail = await Order_detail.findByPk(req.body.id);
    if (!detail) return res.status(404).json({ error: "Not found" });
    res.json(detail);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const {id}=req.body;
    const old=await Order_detail.findByPk(id);
    
    let{order,product,note,softdeleted,quantity,cost}=req.body;
    if(!order)order=old.order_id;
    if(!product)product=old.product_id;
    if(!note)note=old.note;
    if(softdeleted===null || softdeleted===undefined)softdeleted=old.softdeleted;
    if(quantity===null||quantity===undefined)quantity=old.quantity;
    if(cost===null||cost===undefined)cost=old.cost_per_one;

    const [updated] = await Order_detail.update({
      order_id:order,
      product_id:product,
      cost_per_one:cost,
      note,
      softdeleted,
      quantity

    }, {
      where: { id: id },
    });
    if (!updated) return res.status(404).json({ error: "Not found" });
    const updatedDetail = await Order_detail.findByPk(id);
    res.json(updatedDetail);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Order_detail.destroy({ where: { id: req.body.id } });
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deletebyorderid=async (req,res)=>{
  try {
        const {order}=req.body;

    const deleted = await Order_detail.destroy({ where: { order_id: order } });
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
  }
  catch (error) {
        res.status(500).json({ error: error.message });

  }
}

exports.deletebyproductid=async (req,res)=>{
  try {
            const {product}=req.body;

    const deleted = await Order_detail.destroy({ where: { product_id: product } });
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
    
  } catch (error) {
        res.status(500).json({ error: error.message });

  }
}

exports.soft_delete=async (req,res)=>{
  try{
    const {id}=req.body;
  const [order_soft_delete]=await Order_detail.update({softdeleted: 1},{where:{id:id}})
    if(!order_soft_delete)return res.status(404).json({error:"NOt Found Order"});
    res.json({message:"seccessfully soft Deleted"});
  }catch (error) {
        res.status(500).json({ error: error.message });

  }
}