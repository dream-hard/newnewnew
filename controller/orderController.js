const { Op, Sequelize, where, Transaction } = require("sequelize");
const { Order, Order_detail, Address, User, Shipping, Order_statu, Exchange_rate, Supplier_shipment_detail, Product, Shipping_method, Category, Product_statu, Product_condition, Product_image } = require("../models/index.js");
const { DB } = require("../config/config.js");
const bcrypt=require("bcryptjs");



const orderOrderByMap = {
  "date-asc": [["order_date", "ASC"]],
  "date-desc": [["order_date", "DESC"]],
  "total-asc": [["total_amount", "ASC"]],
  "total-desc": [["total_amount", "DESC"]],
  "paid-asc": [["total_amount_paid", "ASC"]],
  "paid-desc": [["total_amount_paid", "DESC"]],
  "status-asc": [["status_id", "ASC"]],
  "status-desc": [["status_id", "DESC"]],
  "created-asc": [["createdAt", "ASC"]],
  "created-desc": [["createdAt", "DESC"]],
  "updated-asc": [["updatedAt", "ASC"]],
  "updated-desc": [["updatedAt", "DESC"]],
};


exports.create = async (req, res) => {
  try {
    const {user_id,status,shipping_address,note,order_date,paid,softdelete}=req.body;
    
   
   
    const order = await Order.create({
      user_id:user_id,
      shipping_address_id:shipping_address,
      status_id:status,
      order_date,
      total_amound_paid:paid,
      soft_deleted:softdelete,
      note
    });
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
    const {id}=req.body;
    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ error: "Not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const {id}=req.body;
    const old=await Order.findByPk(id);
    let{user_id,shipping_address,status,order_date,paid,softdelete,note}=req.body;
    if(!user_id)user_id=old.user_id;
    if(!shipping_address)shipping_address=old.shipping_address_id;
    if(!status)status=old.status_id;
    if(!note)note=old.note;
    if(!order_date)order_date=old.order_date;
    if(paid===null || paid===undefined)paid=old.paid;
    if(softdelete===null || softdelete===undefined)softdelete=old.soft_deleted;

    const [updated] = await Order.update({
      user_id,
      shipping_address_id:shipping_address,
      order_date,
      status_id:status,
      paid,
      soft_deleted:softdelete,
      note
    }, {
      where: { uuid: id },
    });
    if (!updated) return res.status(404).json({ error: "Not found" });
    const updatedOrder = await Order.findByPk(id);
    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Order.destroy({ where: { uuid: req.query.id } });
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.deletewithoutuuid=async (req,res)=>{
  try {
    const {id}=req.body;
    const  [updateorder_details] = await Order_detail.update({order_id:"not connected"},{where:{order_id:id}});
        const deleted = await Order.destroy({ where: { uuid: req.body.id } });
    if (!deleted) return res.status(404).json({ error: "Not found" });
    
  } catch (error) {
        res.status(500).json({ error: error.message });

  }
}

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};



exports.placeOrder = async (req, res) => {

  let { user_id=null, address_id, custom_address } = req.body;
  let { phoneNumber,reqname, shipping_address, products, note ,currency} = req.body;



  try {

  let total_amount=[];
  let total_amount_paid=[]
  
    let total =0;
    const sqlDateTime = new Date().toISOString().slice(0, 19).replace("T", " ");
    for (const item of products){
          if(item.currency!==currency){      
            const rate = await Exchange_rate.findOne({order:[["dateofstart","DESC"]],where:{base_currency_id:item.currency,target_currency_id:currency,dateofstart:{[Op.lte]:sqlDateTime}}})
            item.cost_per_one = item.cost_per_one * rate.exchange_rate;
            item.currency=currency;
            total += item.cost_per_one * item.quantity;
            }else{
                total += item.cost_per_one * item.quantity;
            }
    }
    total_amount.push({amount:total,currency:currency});
    total_amount_paid.push({amount:0,currency:currency})
    if (!phoneNumber || !products || products.length === 0) {
        return res.status(400).json({ error: "Phone number and products are required" });
    }
    let user;
    if((user_id!==undefined||user_id!==null|| user_id!=="") && !phoneNumber){
      user =await User.findByPk(user_id);
    }else{
      user = await User.findOne({ where: { phone_number:phoneNumber } });

      let hashpassword= await hashPassword("null");
      
          if (!user) {
              // Create guest user
              if(!phoneNumber)return res.status(400).json({msg:"",error : "يجب عليك ارسال رقم الهاتف"})
              user = await User.create({
                  phone_number:phoneNumber,
                  username: "guest_" + reqname,
                  name:`${reqname}`,
                  role_id:"geust",
                  status_id:"pending",
                  passwordhash:hashpassword,
                  bio:"i am auto genrated account",
              });
          }
    } 

    let shipping_address_id = null;
    let final_note = note || "";

    let cost =0;
    if (address_id) {
      
      const address = await Address.findByPk(address_id,{raw:true});
      if (!address) {
        return res.status(404).json({ message: "Address not found" });
      }
      shipping_address_id = address.id;
      cost =address.cost;
    }

    if (custom_address) {
      final_note = final_note
        ? `${final_note} | Shipping Address: ${custom_address}`
        : `Shipping Address: ${custom_address}`;
    }
    


     if (!Array.isArray(total_amount) || total_amount.length === 0) {
      return res.status(400).json({ error: "total_amount must be a non-empty array" });
    }

    // Validate each entry in total_amount
    for (const entry of total_amount) {
      if (typeof entry.currency !== "string" || typeof entry.amount !== "number" || entry.amount < 0) {
        return res.status(400).json({ error: "Invalid entry in total_amount" });
      }
    }
    // 1. إنشاء الأوردر
    let status=await Order_statu.findOne({where:{statu:"pending"}});
    if(!status)return res.status(404).json({error:"not found status (pending)"});
    const order = await Order.create({
      user_id:user.uuid,
      shipping_address_id, 
      note: final_note,
      status_id: status.id, // Pending
      total_amount,
      total_amount_paid:total_amount_paid,

    });

      // the price of each product: the main total_amount_paid or the total amount currency is that and for now it is attached to it 
    const orderDetails = products.map(p => ({
      order_id: order.uuid,
      product_id: p.product_id,
      quantity: p.quantity,
      cost_per_one: p.cost_per_one,
      currency:p.currency,
    }));

    await Order_detail.bulkCreate(orderDetails);
    
    await Shipping.create({
            order_id: order.uuid,
            type: null,
            tracknumber: null,
            shipping_date: null,
            dlivered_date: null,
            cost: cost
        });

    res.status(201).json({ message: "Order created", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.updateOrderStatus = async (req, res) => {
    const { orderId } = req.body;
    const { status_id } = req.body;

    try {
      const {note}=req.body;
      const order_statu=await Order_statu.findByPk(status_id,{raw:true});
      if(!order_statu) return res.status(404).json({error:"not found order status "});
      let shipping ;
        const order = await Order.findByPk(orderId);
        if (!order) return res.status(404).json({ error: "Order not found" });
        let order_update=[];
        
      if(order_statu.statu==="pending")//pending
      {
        [order_update]=order.update({status_id:status_id});
        return res.json({success:true,msg:"succesfull but do not do anything "});
      }
      if(order_statu.statu==="processing")//processing
      {//remo

        const {shipping_date,note,shipping_address_id,shipping_address,edited_products=[],added_products=[],new_total_currency}=req.body;
        const today = new Date().toISOString().split('T')[0];
        
        let total_currency=order.total_amount.map(item=>{
          if(item.amount)return ({currency:item.currency,amount:item.amount});
        });

        if(new_total_currency!==total_currency.currency && (new_total_currency!==null && new_total_currency!==undefined)){
          const new_total_exgrate= await Exchange_rate.findOne({where:{     
                    base_currency_id:total_currency.currency,
                    target_currency_id:new_total_currency,
                    dateofstart: { [Op.lte]: today }
                  },
                  attributes:["exchange_rate"],
                  order:[["dateofstart","DESC"]]
                  ,raw:true
                  });
                  total_currency.currency=new_total_currency;total_currency.amount=new_total_exgrate*total_currency.amount;
                  let new_total_amount=[];new_total_amount.push(total_currency);
          await order.update({total_amount:new_total_amount});
        }
        if(edited_products.length>0|| product.all===true ){
          for ( const product of edited_products) {

              const  old_porduct_details=await Order_detail.findByPk(product.id);
              
              if(product.currency!==old_porduct_details.currency){
                

                const productdetailexg=await Exchange_rate.findOne({where:{     
                    base_currency_id:old_porduct_details.currency,
                    target_currency_id:product.currency,
                    dateofstart: { [Op.lte]: today }
                  },
                  attributes:["exchange_rate"],
                  order:[["dateofstart","DESC"]]
                  ,raw:true
                  });
                  await old_porduct_details.update({currency:product.currency,cost_per_one:productdetailexg.exchange_rate*old_porduct_details.cost_per_one});
                };


              const total_amount_exgrate=await Exchange_rate.findOne({where:{
                base_currency_id:old_porduct_details.currency,
                target_currency_id:total_currency.currency,
                dateofstart:today,
              },
                attributes:["exchange_rate"],
                order:[["dateofstart","DESC"]]
                ,raw:true});
                
                
              if(product.all===true){

                let new_total_amount=order.total_amount.map(item => {
                  if (item.amount>0 ){
                    return { ...item, amount:item.amount- (old_porduct_details.quantity*old_porduct_details.cost_per_one*total_amount_exgrate) }; // edit attribute
                  }
                  return item;
                });

                const order_udpate= await order.update({total_amount:new_total_amount});
                
                if(product.softdelete===true){
                  await old_porduct_details.update({soft_deleted:true,note});
                }else{
                  await old_porduct_details.destroy();
                }
              }else{
                if(product.number>old_porduct_details.quantity){
                  let dev=product.number-old_porduct_details.quantity;
                  await old_porduct_details.update({quantity:product.number});
                  let new_total_amount=order.total_amount.map(item => {
                    if (item.amount>0 ){
                      return { ...item, amount:item.amount+ (dev*old_porduct_details.cost_per_one*total_amount_exgrate) }; // edit attribute
                    }
                    return item;
                  });

                  const order_udpate= await order.update({total_amount:new_total_amount});

                }else{
                  if(product.number<old_porduct_details){
                    let dev=Math.abs(product.number-old_porduct_details.quantity);
                    let new_total_amount=order.total_amount.map(item => {
                      if (item.amount>0 ){
                        return { ...item, amount:item.amount- (dev*old_porduct_details.cost_per_one*total_amount_exgrate) }; // edit attribute
                      }
                      return item;
                    });
                    const order_udpate= await order.update({total_amount:new_total_amount});

                  }
                }
              }
          };
          
        }  

        if(added_products.length>0){
          let totals=0;
          for(const product of added_products){
            //product={product_id,quantity,cost_per_one,currency}
            if(product.currency!==total_currency.currency){
              let product_currency_to_total_currency_exgrate= await Exchange_rate.findOne({where:{
                base_currency_id:product.currency,
                target_currency_id:total_currency.currency,
                dateofstart:today,
              },
              attributes:["exchange_rate"],
              order:[["dateofstart","DESC"]],
              raw:true});

              product.cost_per_one=product.cost_per_one*product_currency_to_total_currency_exgrate;
            }
            totals+=product.cost_per_one*product.quantity;
          }
          let new_total_amount=order.total_amount.map(item => {
                    if (item.amount>0 ){
                      return { ...item, amount:item.amount+totals }; // edit attribute
                    }
                    return item;
                  });
          
          const orderDetails = added_products.map(p => ({
            order_id: order.uuid,
            product_id: p.product_id,
            quantity: p.quantity,
            cost_per_one: p.cost_per_one,
            currency:currency,//the total amount currency
          }));
       
          const order_udpate= await order.update({total_amount:new_total_amount});
          await Order_detail.bulkCreate(orderDetails);

        }      
        let address;
        let old_note=order.note;
        let old_shipping_address_id=order.shipping_address_id;
        
        if(shipping_address_id!==null && shipping_address_id!==undefined){
          address=await Address.findByPk(shipping_address);
          if(address){
            old_shipping_address_id=address.id;
            const shipping_update=await Shipping.update({cost:address.cost},{where:{order_id:order.uuid}});
          }}
        if((shipping_address!==null && shipping_address!==undefined)&&shipping_address.length>0){
          old_note = old_note
            ? `${old_note} | Shipping Address: ${shipping_address}`
            : `Shipping Address: ${shipping_address}`;
        }

        [order_update] =await order.update({status_id,shipping_address_id:old_shipping_address_id,note:old_note});
        const shipping_update=await Shipping.update({shipping_date:shipping_date});
        return res.json({success:true,msg:"updated succesfull"});
      }
      if(order_statu.statu==="shipped")//shipped
      {
        const {dlivered_date}=req.body;
        try {
        [order_update]=await order.update({status_id:status_id});
        const shipping_update=await Shipping.update({dlivered_date},{where:{order_id:order.uuid}})
        return res.json({success:true,msg:"updated succesfull و الطلب اصبح جاهز عند الزبون "});
  
        } catch (error) {

        }
        
      }
      if(order_statu.statu==="completed")//completed
      {
            let total_amount_currency=order.total_amount.map(item => {
                    if (item.amount>0 ){
                      return item;
                    }
                    
                  });
        let total_amound_paid_currency=order.total_amound_paid.map(item=>{
          if(item.currency===total_amount_currency.currency)
            {
              if(item.amount!==total_amount_currency.amount)
              {
                return res.status(400).json({error:"لم يتم دفع المبلغ كامل و بالتالي الاوردر غير كامل"});
              }
            }
        });
        let productstodeletecount=await Order_detail.findAll({attributes:["product_id","quantity"],raw:true},{where:{order_id:order.uuid}});
      
        const t = await sequelize.transaction();
        
        try {
          for (const { product_id, quantity } of productstodeletecount) {
            let remainingQty = quantity;

            // Fetch all shipment details with available quantity, oldest first
            const shipmentDetails = await Supplier_shipment_detail.findAll({
              where: {
                product_id,
                quantity: { [Sequelize.Op.gt]: 0 } // فقط الشحنات التي تحتوي على كمية أكبر من صفر
              },
              order: [['createdAt', 'ASC']], 
              transaction: t,
              lock: t.LOCK.UPDATE
            });

            // Check if total stock is enough
            const totalStock = shipmentDetails.reduce((sum, sd) => sum + sd.quantity, 0);
            if (totalStock < quantity) {
              throw new Error(`Not enough stock for product_id ${product_id}`);
            }

            // Deduct quantity from shipments
            for (const sd of shipmentDetails) {
              if (remainingQty <= 0) break;

              const deductQty = Math.min(sd.quantity, remainingQty);

              await sd.update(
                { quantity: sequelize.literal(`quantity - ${deductQty}`) },
                { transaction: t }
              );

              remainingQty -= deductQty;
            }
          }

          await t.commit();
        } catch (err) {
          await t.rollback();
          
          return res.status(400).json({error:"threr is an error: ",err:err});
          
        }


        [order_update]=await order.update({status_id:status_id});
        return res.status(200).json({success:true,msg:"تم الانتهاء من الطلب بنجاح و تم إنقاص عدد المنتجات من النظام"});
      
      }
      if(order_statu.statu==="cancelled")//cancelled (before paying or shipping)
      {
        let {withdelete=false}=req.body;
        try {
        let cancel;
        if(!withdelete){
        order_update=await order.update({status_id:status_id});
        return res.status(200).json({success:true,msg:"تم إالغاء الطلب بنجاح من دون الإزالة كليا"});
        }else{
        order_update=await order.update({status_id:status_id});
        cancel = await order.destroy();
        return res.status(200).json({success:true,msg:"تم إالغاء الطلب بنجاح مع الإزالة كليا"});
 
        }  
        } catch (error) {
          throw error;
        }
        

        

      }
      if(order_statu.statu==="returned")//returned (after shipping before paying)
      {
        const {costing=0,costing_currency="SYP"}=req.body;
        try{
          let total_amount_paid_update=order.total_amount_paid.map(item => {
                    if (item.currency===costing_currency ){
                      return { ...item, amount:item.amount-costing }; // edit attribute
                    }
                    return item;
                   });
          
          
          [order_update]=await order.update({status_id:status_id,total_amount_paid:total_amount_paid_update});
          if(costing>0)
            return res.status(200).json({success:true,msg:"تم إرجاع الطلب بدون  دفع التوصيل"})
          if(costing===0)
            return res.status(200).json({success:true,msg:"تم إرجاع الطلب مع دفع اجار الطريق"});


        } catch (error) {
           throw error;
        }
      }
      if(order_statu.statu==="refunded")//refunded      
      { const {recount=false,costing=0,costing_currency="SYP"}=req.body;
      try {
        let new_total_amount=order.total_amount_paid.map(item=>{
          if(item.amount>0){
            return {...item,amount:0};
          }
          return item;
        });
        let total_amound_paid_update=order.new_total_amount.map(item => {
              if (item.currency===costing_currency ){
                return { ...item, amount:item.amount-costing }; // edit attribute
              }
              return item;
              });

        [order_update]=await order.update({status_id:status_id,total_amount_paid:total_amound_paid_update});

        let productstodeletecount=await Order_detail.findAll({attributes:["product_id","quantity"],raw:true},{where:{order_id:order.uuid}});
        if(recount){
        const t = await sequelize.transaction();

        try {
          for (const { product_id, quantity } of productstodeletecount) {
            await Supplier_shipment_detail.update(
              { quantity: sequelize.literal(`quantity + ${quantity}`)},
              { where: { product_id }, transaction: t }
            );
          }
          await t.commit();
        } catch (err) {

          await t.rollback();
          return res.status(400).json({error:"threr is an error: ",err:err});
          
        }}
        
      } catch (error) {
        throw error;
      }

      }
      else
      {
        return res.status(400).json({error:"not allowed order status"})
      }
        return res.json({ success: true, order });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
exports.payingorder=async(req,res)=>{
  try {
    let {paid,currency,order_id}=req.body;

    paid=parseFloat(paid);
    const order=await Order.findByPk(order_id);
    if(!order)return res.status(404).json({msg:"",error:"not found order"});
    const today = new Date().toISOString().split('T')[0];
    let total_amount_infos=order.total_amount.map(item => {
                    if (item.amount>0 ){
                      return item;
                    }
                    
                  });
let total_amount_paid_infos=[];
    if(currency!==total_amount_infos.currency){
        const productdetailexg=await Exchange_rate.findOne({where:{     
            base_currency_id:currency,
            target_currency_id:total_amount_infos.currency,
            dateofstart: { [Op.lte]: today }
            },
            attributes:["exchange_rate"],
            order:[["dateofstart","DESC"]]
          
          });
      total_amount_paid_infos.push({currency:total_amount_infos.currency,amount:paid*productdetailexg.exchange_rate});
    }else{
      total_amount_paid_infos.push({currency:currency,amount:paid})
    }
    order.total_amound_paid=total_amount_paid_infos;
    await order.save();
    res.status(200).json({success:true,msg:`تم الدفع بنجاح و المبلغ هو ${total_amount_paid_infos.amount}, من اصل ${total_amount_infos.amount},بعملة : ${total_amount_infos.currency}`});
    
  } catch (error) {
            return res.status(500).json({ error: err.message });
  }
}


exports.updateOrderStatustest = async (req, res) => {
  const t = await DB.transaction();
  try {
    const { orderId, status_id } = req.body;
    if (!orderId || !status_id) return res.status(400).json({ error: "orderId and status_id required" });

    const order_statu = await Order_statu.findByPk(status_id, { raw: true });
    if (!order_statu) {
      await t.rollback();
      return res.status(404).json({ error: "Order status not found" });
    }

    const order = await Order.findByPk(orderId);
    if (!order) {
      await t.rollback();
      return res.status(404).json({ error: "Order not found" });
    }

    // helper: normalize fields
    const safeTotalAmount = Array.isArray(order.total_amount) ? order.total_amount : [];

    // handling based on status name
    const statuName = String(order_statu.statu || "").toLowerCase();

    // ---------- pending -> just set status ----------
    if (statuName === "pending") {
      await order.update({ status_id }, { transaction: t });
      await t.commit();
      return res.json({ success: true, msg: "Status updated (pending)", order });
    }

    // ---------- processing: edits + adds + shipping changes ----------
    if (statuName === "processing") {
      const {
        shipping_date, note = "", shipping_address_id, shipping_address,
        edited_products = [], added_products = [], new_total_currency
      } = req.body;

      // Update currency if requested (very cautious)
      if (new_total_currency) {
        // convert each entry through the exchange rate (pick last known rate)
        const today = new Date().toISOString().split('T')[0];
        const converted = [];
        for (const entry of safeTotalAmount) {
          if (!entry || typeof entry !== 'object') continue;
          const base = entry.currency;
          const amount = Number(entry.amount || 0);
          if (!base || !new_total_currency || base === new_total_currency) {
            converted.push({ currency: base, amount });
            continue;
          }
          const er = await Exchange_rate.findOne({
            where: { base_currency_id: base, target_currency_id: new_total_currency, dateofstart: { [Op.lte]: today } },
            order: [["dateofstart", "DESC"]],
            attributes: ["exchange_rate"],
            raw: true
          });
          const rate = er?.exchange_rate ?? 1;
          converted.push({ currency: new_total_currency, amount: Number((amount * rate).toFixed(2)) });
        }
        if (converted.length) {
          await order.update({ total_amount: converted }, { transaction: t });
        }
      }

      // edited_products: update existing order_details
      // shape expected: [{ id, number, softdelete, currency, all }]
      if (Array.isArray(edited_products) && edited_products.length) {
        const today = new Date().toISOString().split('T')[0];
        for (const p of edited_products) {
          if (!p || !p.id) continue;
          const od = await Order_detail.findByPk(p.id, { transaction: t });
          if (!od) continue;

          // if currency change: adjust cost_per_one using exchange rate
          if (p.currency && p.currency !== od.currency) {
            const er = await Exchange_rate.findOne({
              where: { base_currency_id: od.currency, target_currency_id: p.currency, dateofstart: { [Op.lte]: today } },
              order: [["dateofstart", "DESC"]],
              attributes: ["exchange_rate"],
              raw: true
            });
            const rate = er?.exchange_rate ?? 1;
            await od.update({ currency: p.currency, cost_per_one: Number((od.cost_per_one * rate).toFixed(2)) }, { transaction: t });
          }

          // if 'all' — remove or softdelete the order_detail
          if (p.all === true) {
            if (p.softdelete) {
              await od.update({ softdeleted: true, note: p.note || note }, { transaction: t });
            } else {
              await od.destroy({ transaction: t });
            }
            continue;
          }

          // update quantity if provided
          if (typeof p.number === "number" && p.number >= 1) {
            if (p.number !== od.quantity) {
              const delta = p.number - od.quantity;
              await od.update({ quantity: p.number }, { transaction: t });

              // update order.total_amount: find numeric entries and adjust roughly by delta * cost_per_one
              const total_amount_copy = Array.isArray(order.total_amount) ? [...order.total_amount] : [];
              // attempt to convert cost_per_one to total currency if necessary (skip complex multi-currency logic for brevity)
              for (let i = 0; i < total_amount_copy.length; i++) {
                if (!total_amount_copy[i]) continue;
                // naive approach: if entry.amount>0 adjust by delta*cost_per_one (best-effort)
                if (total_amount_copy[i].amount && Number(total_amount_copy[i].amount) >= 0) {
                  total_amount_copy[i].amount = Number((Number(total_amount_copy[i].amount) + (delta * Number(od.cost_per_one))).toFixed(2));
                }
              }
              await order.update({ total_amount: total_amount_copy }, { transaction: t });
            }
          }
        }
      }

      // added_products: bulk create new order_details and update total
      if (Array.isArray(added_products) && added_products.length) {
        let totalsByCurrency = {}; // { currency: total }
        for (const p of added_products) {
          // p: { product_id, quantity, cost_per_one, currency }
          if (!p.product_id || !p.quantity) continue;
          const currency = p.currency || (safeTotalAmount[0] && safeTotalAmount[0].currency) || "SYP";
          const cost = Number(p.cost_per_one || 0);
          totalsByCurrency[currency] = (totalsByCurrency[currency] || 0) + (cost * Number(p.quantity || 0));
        }
        // apply totals to order.total_amount (add)
        const copy = Array.isArray(order.total_amount) ? JSON.parse(JSON.stringify(order.total_amount)) : [];
        for (const [currency, val] of Object.entries(totalsByCurrency)) {
          const idx = copy.findIndex(x => x.currency === currency);
          if (idx >= 0) copy[idx].amount = Number((Number(copy[idx].amount || 0) + val).toFixed(2));
          else copy.push({ currency, amount: Number(val.toFixed(2)) });
        }
        await order.update({ total_amount: copy }, { transaction: t });

        // create Order_detail rows
        const details = added_products.map(p => ({
          order_id: order.uuid,
          product_id: p.product_id,
          quantity: p.quantity,
          cost_per_one: p.cost_per_one,
          currency: p.currency || (safeTotalAmount[0] && safeTotalAmount[0].currency) || "SYP",
        }));
        await Order_detail.bulkCreate(details, { transaction: t });
      }

      // shipping address updates
      let shipping_id_to_update = order.shipping_address_id;
      if (shipping_address_id) {
        // if provided numeric id, set it
        shipping_id_to_update = shipping_address_id;
      } else if (shipping_address && typeof shipping_address === "string") {
        // keep address as note
        // merge into note
      }

      const newNote = order.note ? `${order.note} | ${note}` : note;
      await order.update({ status_id, shipping_address_id: shipping_id_to_update, note: newNote }, { transaction: t });

      // optional shipping table update
      if (shipping_date) {
        await Shipping.update({ shipping_date }, { where: { order_id: order.uuid }, transaction: t }).catch(()=>{});
      }

      await t.commit();
      return res.json({ success: true, msg: "Order processing updates applied" });
    } // end processing

    // ---------- shipped ----------
    if (statuName === "shipped") {
      const { dlivered_date } = req.body;
      await order.update({ status_id }, { transaction: t });
      if (dlivered_date) {
        await Shipping.update({ dlivered_date }, { where: { order_id: order.uuid }, transaction: t }).catch(()=>{});
      }
      await t.commit();
      return res.json({ success: true, msg: "Order marked shipped" });
    }

    // ---------- completed: reduce inventory ----------
    if (statuName === "completed") {
      // ensure payment matches total_amount
      const total_amount = Array.isArray(order.total_amount) ? order.total_amount : [];
      const paid_amount = Array.isArray(order.total_amount_paid) ? order.total_amount_paid : [];
      // very simple validation: check currency sums equal for first currency entry
      const firstTotal = total_amount[0] || {};
      const firstPaid = paid_amount.find(p => p.currency === firstTotal.currency) || {};
      if (!firstPaid || Number(firstPaid.amount || 0) < Number(firstTotal.amount || 0)) {
        await t.rollback();
        return res.status(400).json({ error: "Payment not complete" });
      }

      // reduce inventory across shipments (oldest shipments first)
      const productCounts = await Order_detail.findAll({ where: { order_id: order.uuid }, attributes: ["product_id", "quantity"], raw: true, transaction: t });

      for (const { product_id, quantity } of productCounts) {
        let remaining = Number(quantity);
        // fetch shipments with quantity>0 oldest first
        const shipments = await Supplier_shipment_detail.findAll({
          where: { product_id, quantity: { [Op.gt]: 0 } },
          order: [['createdAt', 'ASC']],
          transaction: t,
          lock: t.LOCK.UPDATE
        });

        const totalAvailable = shipments.reduce((s, x) => s + Number(x.quantity || 0), 0);
        if (totalAvailable < remaining) {
          await t.rollback();
          return res.status(400).json({ error: `Not enough stock for product ${product_id}` });
        }

        for (const s of shipments) {
          if (remaining <= 0) break;
          const deduct = Math.min(remaining, Number(s.quantity || 0));
          // atomic update using sequelize.literal
          await Supplier_shipment_detail.update({ quantity: DB.literal(`quantity - ${deduct}`) }, { where: { id: s.id }, transaction: t });
          remaining -= deduct;
        }
      }

      await order.update({ status_id }, { transaction: t });
      await t.commit();
      return res.json({ success: true, msg: "Order completed and stock reduced" });
    }

    // ---------- cancelled ----------
    if (statuName === "cancelled") {
      const { withdelete = false } = req.body;
      await order.update({ status_id }, { transaction: t });
      if (withdelete) {
        await order.destroy({ transaction: t });
        await t.commit();
        return res.json({ success: true, msg: "Order cancelled and removed" });
      } else {
        await t.commit();
        return res.json({ success: true, msg: "Order cancelled" });
      }
    }

    // ---------- returned ----------
    if (statuName === "returned") {
      const { costing = 0, costing_currency = "SYP" } = req.body;
      // decrease total paid or adjust as appropriate
      let paidCopy = Array.isArray(order.total_amount_paid) ? JSON.parse(JSON.stringify(order.total_amount_paid)) : [];
      for (let i = 0; i < paidCopy.length; i++) {
        if (paidCopy[i].currency === costing_currency) {
          paidCopy[i].amount = Number((paidCopy[i].amount - Number(costing || 0)).toFixed(2));
        }
      }
      await order.update({ status_id, total_amount_paid: paidCopy }, { transaction: t });
      await t.commit();
      return res.json({ success: true, msg: "Order returned" });
    }

    // ---------- refunded ----------
    if (statuName === "refunded") {
      const { recount = false, costing = 0, costing_currency = "SYP" } = req.body;
      // set total paid amounts to zero (or adjust)
      let paidCopy = Array.isArray(order.total_amount_paid) ? JSON.parse(JSON.stringify(order.total_amount_paid)) : [];
      for (let i = 0; i < paidCopy.length; i++) {
        if (paidCopy[i].currency === costing_currency) {
          paidCopy[i].amount = Number((paidCopy[i].amount - Number(costing || 0)).toFixed(2));
        } else {
          paidCopy[i].amount = 0;
        }
      }
      await order.update({ status_id, total_amount_paid: paidCopy }, { transaction: t });

      if (recount) {
        // add back quantities from order_details to shipments (increase)
        const productCounts = await Order_detail.findAll({ where: { order_id: order.uuid }, attributes: ["product_id", "quantity"], raw: true, transaction: t });
        for (const { product_id, quantity } of productCounts) {
          await Supplier_shipment_detail.update({ quantity: DB.literal(`quantity + ${quantity}`) }, { where: { product_id }, transaction: t });
        }
      }

      await t.commit();
      return res.json({ success: true, msg: "Order refunded" });
    }

    await t.rollback();
    return res.status(400).json({ error: "Status logic not implemented for this status" });
  } catch (err) {
    await t.rollback();
    console.error("updateOrderStatus error:", err);
    return res.status(500).json({ error: err.message || "Internal error" });
  }
};

exports.payingordertest = async (req, res) => {
  try {
    let { paid, currency, order_id } = req.body;
    if (!order_id) return res.status(400).json({ error: "order_id required" });
    paid = Number(paid || 0);

    const order = await Order.findByPk(order_id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    const today = new Date().toISOString().split('T')[0];
    const totalInfos = Array.isArray(order.total_amount) ? order.total_amount : [];
    if (!totalInfos.length) return res.status(400).json({ error: "order total_amount missing" });

    // target currency = first total entry currency (simplify)
    const targetCurrency = totalInfos[0].currency;
    let newPaid = paid;

    if (currency !== targetCurrency) {
      const er = await Exchange_rate.findOne({
        where: { base_currency_id: currency, target_currency_id: targetCurrency, dateofstart: { [Op.lte]: today } },
        order: [["dateofstart", "DESC"]],
        attributes: ["exchange_rate"],
        raw: true
      });
      const rate = er?.exchange_rate ?? 1;
      newPaid = paid * rate;
    }

    // overwrite total_amount_paid (append or sum logic — here we set/append conservative)
    let paidArray = Array.isArray(order.total_amount_paid) ? JSON.parse(JSON.stringify(order.total_amount_paid)) : [];
    const idx = paidArray.findIndex(p => p.currency === targetCurrency);
    if (idx >= 0) {
      paidArray[idx].amount = Number((Number(paidArray[idx].amount || 0) + newPaid).toFixed(2));
    } else {
      paidArray.push({ currency: targetCurrency, amount: Number(newPaid.toFixed(2)) });
    }

    order.total_amount_paid = paidArray;
    await order.save();

    return res.status(200).json({ success: true, msg: `Paid ${newPaid} ${targetCurrency}`, paid: paidArray });
  } catch (err) {
    console.error("payingorder error:", err);
    return res.status(500).json({ error: err.message || "Internal error" });
  }
}
exports.softdelete=async (req,res)=>{
  try {
    const {id}=req.body;
    const order =await Order.findByPk(id);
    if(!order)return res.status(404).json({error:"NOT FOUND ORDER"});
    await order.update({softdelete:true});

    return res.stats(201).json({success:true,msg:"soft deleted succes"});
  } catch (error) {
            return res.status(500).json({ error: err.message });

  }
}



exports.justgetall=async(req,res)=>{
  try {
    const orders=await Order.findAll({attributes:["uuid","status_id","user_id"],raw:true });

    res.status(200).json (orders);
  } catch (error) {
     res.status(500).json({ error: error.message });

  }
}

// ============== FILTER ORDERS ==================
exports.filterorders = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      orderby,
      id,
      user_id,
      address_id,
      status_id,
      status,
      order_date,
      order_date_dir = "eq",
      total_amount,
      total_amound_currency,
      total_amount_dir = "eq",
      total_amount_paid,
      total_amount_paid_dir= "eq",
      total_amound_paid_currency,
      soft_deleted,
      note,
      product_ids,

    } = req.body;

    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;

    let order = orderOrderByMap[orderby] || orderOrderByMap["created-desc"];

    let where = {};
    if (id) where.uuid = id;
    if (user_id) where.user_id = user_id;
    if (address_id) where.shipping_address_id = address_id;
    if (status_id) where.status_id = status_id;
    if (soft_deleted !== undefined) where.soft_deleted = soft_deleted;
    if (note) where.note = { [Op.like]: `%${note}%` };

    // order_date filtering
    if (order_date !== undefined && order_date_dir) {
      switch (order_date_dir) {
        case "eq":
          where.order_date = { [Op.eq]: order_date };
          break;
        case "gte":
          where.order_date = { [Op.gte]: order_date };
          break;
        case "lte":
          where.order_date = { [Op.lte]: order_date };
          break;
        case "gt":
          where.order_date = { [Op.gt]: order_date };
          break;
        case "lt":
          where.order_date = { [Op.lt]: order_date };
          break;
      }
    }

    // total_amount filtering (JSON with currency)
// total_amount filtering with dir
if (total_amount !== undefined && total_amound_currency) {
  switch (total_amount_dir) {
    case "eq":
      where[Op.and] = Sequelize.literal(
        `CAST(JSON_UNQUOTE(JSON_EXTRACT(total_amount, '$[*].amount')) AS DECIMAL(20,2)) = ${total_amount}`
      );
      break;
    case "gte":
      where[Op.and] = Sequelize.literal(
        `CAST(JSON_UNQUOTE(JSON_EXTRACT(total_amount, '$[*].amount')) AS DECIMAL(20,2)) >= ${total_amount}`
      );
      break;
    case "lte":
      where[Op.and] = Sequelize.literal(
        `CAST(JSON_UNQUOTE(JSON_EXTRACT(total_amount, '$[*].amount')) AS DECIMAL(20,2)) <= ${total_amount}`
      );
      break;
    case "gt":
      where[Op.and] = Sequelize.literal(
        `CAST(JSON_UNQUOTE(JSON_EXTRACT(total_amount, '$[*].amount')) AS DECIMAL(20,2)) > ${total_amount}`
      );
      break;
    case "lt":
      where[Op.and] = Sequelize.literal(
        `CAST(JSON_UNQUOTE(JSON_EXTRACT(total_amount, '$[*].amount')) AS DECIMAL(20,2)) < ${total_amount}`
      );
      break;
    default:
      where[Op.and] = Sequelize.literal(
        `CAST(JSON_UNQUOTE(JSON_EXTRACT(total_amount, '$[*].amount')) AS DECIMAL(20,2)) = ${total_amount}`
      );
      break;
  }

  // also filter by currency inside JSON
  where[Op.and] = Sequelize.literal(
    `JSON_SEARCH(total_amount, 'one', '${total_amound_currency}', NULL, '$[*].currency') IS NOT NULL`
  );
}

// total_amount_paid filtering with dir
if (total_amount_paid !== undefined && total_amound_paid_currency) {
  switch (total_amount_paid_dir) {
    case "eq":
      where[Op.and] = Sequelize.literal(
        `CAST(JSON_UNQUOTE(JSON_EXTRACT(total_amount_paid, '$[*].amount')) AS DECIMAL(20,2)) = ${total_amount_paid}`
      );
      break;
    case "gte":
      where[Op.and] = Sequelize.literal(
        `CAST(JSON_UNQUOTE(JSON_EXTRACT(total_amount_paid, '$[*].amount')) AS DECIMAL(20,2)) >= ${total_amount_paid}`
      );
      break;
    case "lte":
      where[Op.and] = Sequelize.literal(
        `CAST(JSON_UNQUOTE(JSON_EXTRACT(total_amount_paid, '$[*].amount')) AS DECIMAL(20,2)) <= ${total_amount_paid}`
      );
      break;
    case "gt":
      where[Op.and] = Sequelize.literal(
        `CAST(JSON_UNQUOTE(JSON_EXTRACT(total_amount_paid, '$[*].amount')) AS DECIMAL(20,2)) > ${total_amount_paid}`
      );
      break;
    case "lt":
      where[Op.and] = Sequelize.literal(
        `CAST(JSON_UNQUOTE(JSON_EXTRACT(total_amount_paid, '$[*].amount')) AS DECIMAL(20,2)) < ${total_amount_paid}`
      );
      break;
    default:
      where[Op.and] = Sequelize.literal(
        `CAST(JSON_UNQUOTE(JSON_EXTRACT(total_amount_paid, '$[*].amount')) AS DECIMAL(20,2)) = ${total_amount_paid}`
      );
      break;
  }

  where[Op.and] = Sequelize.literal(
    `JSON_SEARCH(total_amount_paid, 'one', '${total_amound_paid_currency}', NULL, '$[*].currency') IS NOT NULL`
  );
}

    const includeOptions = [
      {
        model: User,
        attributes: ["uuid", "username", "phone_number"],
      },
      {
        model: Address,
        attributes: ["id", "name", "cost"],
      },
      {
        model: Order_statu,
        attributes: ["id", "statu"],
      
      },
      
    ];
  
    if(status){includeOptions[2].where={statu:status}
        includeOptions[2].required = true;
};

    let matchedIds = null;
    if (product_ids && product_ids.length > 0) {
      const idsRows = await Order_detail.findAll({
        attributes: [],
        where: { product_id: { [Op.in]: product_ids } },
        group: ['order_id'],
        having: Sequelize.literal(`COUNT(DISTINCT product_id) = ${product_ids.length}`),
        raw: true
      });
      matchedIds = idsRows.map(r => r.order_id);
      if (matchedIds.length === 0) {
        return res.status(200).json({ products: [], total: 0, currentPage: page, totalPages: 0 });
      }
      // ضيف شرط للـ where ليجلب المنتجات اللي بترجعهم matchedIds
      where.uuid = { [Op.in]: matchedIds };
    }

    const queryOptions = {
      where,
      include: includeOptions,
      order,
      limit,
      offset,
      subQuery: false,
      distinct: true,
    };

    const { count, rows } = await Order.findAndCountAll(queryOptions);

    return res.status(200).json({
      orders: rows,
      total: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ============== SEARCH IN ORDERS ==================
exports.searchinorders = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      orderby,
      id,
      user_id,
      address_id,
      status_id,
      status,
      order_date,
      order_date_dir = "eq",
      total_amount,
      total_amound_currency,
      total_amount_dir = "eq",
      total_amount_paid,
      total_amound_paid_currency,

      soft_deleted,
      note,
    } = req.body;

    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;

    let order = orderOrderByMap[orderby] || orderOrderByMap["created-desc"];

    let where = {};
        if (order_date !== undefined && order_date_dir) {
      switch (order_date_dir) {
        case "eq":
          where.order_date = { [Op.eq]: order_date };
          break;
        case "gte":
          where.order_date = { [Op.gte]: order_date };
          break;
        case "lte":
          where.order_date = { [Op.lte]: order_date };
          break;
        case "gt":
          where.order_date = { [Op.gt]: order_date };
          break;
        case "lt":
          where.order_date = { [Op.lt]: order_date };
          break;
      }
    }
    if (id) where.id = { [Op.like]: `%${id}%` };
    if (user_id) where.user_id = { [Op.like]: `%${user_id}%` };
    if (address_id) where.shipping_address_id = { [Op.like]: `%${address_id}%` };
    if (status_id) where.status_id = { [Op.like]: `%${status_id}%` };
    if (soft_deleted !== undefined) where.soft_deleted = soft_deleted;

    // fuzzy search for note and status
    if (note) where.note = { [Op.like]: `%${note}%` };
    if (status) {
      // search through joined status
    }

    const includeOptions = [
      {
        model: User,
        attributes: ["uuid", "name", "phone_number"],
      },
      {
        model: Address,
        attributes: ["id", "name", "price"],
      },
      {
        model: OrderStatus,
        attributes: ["id", "statu"],
        where: status
          ? { statu: { [Op.like]: `%${status}%` } }
          : undefined,
      },
    ];

    const queryOptions = {
      where,
      include: includeOptions,
      order,
      limit,
      offset,
      subQuery: false,
      distinct: true,
    };

    const { count, rows } = await Order.findAndCountAll(queryOptions);

    return res.status(200).json({
      orders: rows,
      total: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.justgetall=async(req,res)=>{
  try {
    let {page=1,limit=Number.MAX_SAFE_INTEGER,orderby}=req.body;
    page = parseInt(page);
    limit=parseInt(limit);
    const offset=(page-1)*limit;
    const order=orderOrderByMap[orderby]||orderOrderByMap["created-desc"];
      const includeOptions = [
      {
        model: User,
        attributes: ["uuid", "name", "phone_number"],
      },
      {
        model: Address,
        attributes: ["id", "name", "price"],
      },
      {
        model:Order_statu,
        attributes: ["id", "statu"],
      }
    ];

    const { count, rows } = await Order.findAndCountAll({
      raw:false,
      order,
      offset,
      limit,
      include: includeOptions,
      
    });

    return res.status(200).json({
      orders: rows,
      total: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
        res.status(500).json({ error: error.message });
  }
}

exports.justgetalltheorder=async (req,res)=>{
  try {
    const {order_id}=req.body;
    if(!order_id)return res.status(404).json({msg:"",error:"please send the order id"});
    const includeOptions=[
      {model:User,
        attributes:['uuid',"name","phone_number",'profile_pic'],
      },
      {model:Shipping,
        attributes:['tracknumber',"cost",'shipping_date',"dlivered_date","note"],
        required:false,
        include:[{model:Shipping_method,attributes:['name','cost']}]
      },
      {model:Order_statu,
        attributes:['statu'],
        required:false,

      },
      {model:Order_detail,
        where:{softdeleted:false},
        attributes:["id",'note',"quantity","cost_per_one","currency"],
        required:true,
        include:[{model:Product,
                  include:[
                          {model:Category,
                            attributes:["slug","display_name"],
                          },
                     
                          {
                            model:Product_statu,
                            attributes:['statu']
                          },
                          {
                            model:Product_condition,
                            attributes:['condition']
                          },
                          {
                            model:Product_image,
                            attributes:['filename'],
                            where:{image_type:"main"}
                          }],
                  attributes:['currency_id',"title","slug","isactive_name","isactive_price","isactive_phonenumber","discount","price","original_price","warranty","warranty_period"]}]

      }];
      const order =await Order.findOne({include:includeOptions,where:{uuid:order_id}});
      if(!order)return res.status(404).json({msg:"",error:"Not found any order  details for this order"})
        return res.status(200).json({success:true,order_details:order})
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

exports.justgettheorder=async(req,res)=>{
  try {
        const {order_id}=req.body;
    if(!order_id)return res.status(404).json({msg:"",error:"please send the order id"});
    const includeOptions=[
      {model:User,
        attributes:["name","phone_number",'profile_pic'],
        required:true
      },
      {model:Shipping,
        attributes:['tracknumber',"cost",'shipping_date',"dlivered_date","note"],
        required:false,
        include:[{model:Shipping_method,attributes:['name','cost']}]
      },
      {model:Order_statu,
        attributes:['statu'],
        required:false,

      },
      {model:Order_detail,
        where:{softdeleted:false},
        attributes:["id",'note',"quantity","cost_per_one","currency"],
        required:true,
        include:[{model:Product,
                  include:[
                          {model:Category,
                            attributes:["slug","display_name"],
                          },
                          {
                            model:Product_statu,
                            attributes:['statu']
                          },
                          {
                            model:Product_condition,
                            attributes:['condition']
                          }],
                  attributes:['currency_id',"title","slug","isactive_name","isactive_price","isactive_phonenumber","discount","price","original_price","warranty","warranty_period"]}]

      }];
      const order =await Order_detail.findAll({include:includeOptions,where:{order_id:order_id}});
      if(!order)return res.status(404).json({msg:"",error:"Not found any order  details for this order"})
      return res.status(200).json({success:true,order_details:order})
  } catch (error) {
    
  }
}
exports.justgetmyorders=async(req,res)=>{
  try {
    let {page=1,limit=Number.MAX_SAFE_INTEGER,orderby,user_id=req.user.id}=req.body;
    page=parseInt(page);
    limit=parseInt(limit);
    const offset=(page-1)*limit;
    const order =orderOrderByMap[orderby]||orderOrderByMap['created-desc'];
      const includeOptions = [
      {
        model: User,
        attributes: ["uuid", "name", "phone_number"],
      },
      {
        model: Address,
        attributes: ["id", "name", "price"],
      },
      {
        model:Order_statu,
        attributes: ["id", "statu"],
      }
    ];
    let where ={};
    where.user_id=user_id;
    const { count, rows } = await Order.findAndCountAll({
      where,
      raw:false,
      order,
      offset,
      limit,
      include: includeOptions,
      attributes:['note',"total_amount_paid","total_amount","order_date","uuid"]
      
    });

    return res.status(200).json({
      orders: rows,
      total: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    
  }
}
// controllers/orderController.js

// ============== FILTER ORDERS ==================
exports.filterorders2 = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      orderby,
      id,
      user_id,
      address_id,
      status_id,
      status,
      order_date,
      order_date_dir = "eq",
      total_amount,
      total_amound_currency,
      total_amount_dir = "eq",
      total_amount_paid,
      total_amount_paid_dir = "eq",
      total_amound_paid_currency,
      soft_deleted,
      note,
      product_id,       // can be single id or array
      product_match,    // optional: 'all' => match all product ids, otherwise any
    } = req.body;

    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;

    const order = orderOrderByMap[orderby] || orderOrderByMap["created-desc"];

    // build basic where
    let where = {};
    if (id) where.uuid = id;
    if (user_id) where.user_id = user_id;
    if (address_id) where.shipping_address_id = address_id;
    if (status_id) where.status_id = status_id;
    if (soft_deleted !== undefined) where.soft_deleted = soft_deleted;
    if (note) where.note = { [Op.like]: `%${note}%` };

    // order_date filtering
    if (order_date !== undefined) {
      switch (order_date_dir) {
        case "eq": where.order_date = { [Op.eq]: order_date }; break;
        case "gte": where.order_date = { [Op.gte]: order_date }; break;
        case "lte": where.order_date = { [Op.lte]: order_date }; break;
        case "gt": where.order_date = { [Op.gt]: order_date }; break;
        case "lt": where.order_date = { [Op.lt]: order_date }; break;
        default: where.order_date = { [Op.eq]: order_date }; break;
      }
    }

    // جمع الشروط الـ raw (لـ JSON) في مصفوفة حتى نركبهم مع بعض
    const rawConditions = [];

    // total_amount filtering with dir & currency using JSON_TABLE (MySQL 8+)
    if (total_amount !== undefined && total_amound_currency) {
      // تأكد القيم عددية عشان ما يدخلوا SQL غير متوقع
      const sanitizedAmount = Number(total_amount);
      const currency = String(total_amound_currency).replace(/'/g, "''");

      const cmp = (() => {
        switch (String(total_amount_dir)) {
          case "gte": return `>= ${sanitizedAmount}`;
          case "lte": return `<= ${sanitizedAmount}`;
          case "gt": return `> ${sanitizedAmount}`;
          case "lt": return `< ${sanitizedAmount}`;
          case "eq":
          default: return `= ${sanitizedAmount}`;
        }
      })();

      // JSON_TABLE subquery: finds any element with matching currency and compares amount
      rawConditions.push(
        `EXISTS (
          SELECT 1 FROM JSON_TABLE(total_amount, '$[*]' 
            COLUMNS(
              currency VARCHAR(64) PATH '$.currency',
              amount DECIMAL(65,6) PATH '$.amount'
            )
          ) AS jt WHERE jt.currency = '${currency}' AND jt.amount ${cmp}
        )`
      );
    }

    // total_amount_paid filtering with dir & currency
    if (total_amount_paid !== undefined && total_amound_paid_currency) {
      const sanitizedAmountPaid = Number(total_amount_paid);
      const currencyPaid = String(total_amound_paid_currency).replace(/'/g, "''");

      const cmpPaid = (() => {
        switch (String(total_amount_paid_dir)) {
          case "gte": return `>= ${sanitizedAmountPaid}`;
          case "lte": return `<= ${sanitizedAmountPaid}`;
          case "gt": return `> ${sanitizedAmountPaid}`;
          case "lt": return `< ${sanitizedAmountPaid}`;
          case "eq":
          default: return `= ${sanitizedAmountPaid}`;
        }
      })();

      rawConditions.push(
        `EXISTS (
          SELECT 1 FROM JSON_TABLE(total_amount_paid, '$[*]' 
            COLUMNS(
              currency VARCHAR(64) PATH '$.currency',
              amount DECIMAL(65,6) PATH '$.amount'
            )
          ) AS jt2 WHERE jt2.currency = '${currencyPaid}' AND jt2.amount ${cmpPaid}
        )`
      );
    }

    // لو في raw conditions ضيفهم للـ where مع Op.and
    if (rawConditions.length > 0) {
      where[Op.and] = rawConditions.map(cond => Sequelize.literal(cond));
    }

    // build include options
    const includeOptions = [
      {
        model: User,
        attributes: ["uuid", "username", "phone_number"],
      },
      {
        model: Address,
        attributes: ["id", "name", "cost"],
      },
      {
        model: Order_statu,
        attributes: ["id", "statu"],
      },
    ];

    if (status) {
      // لو بدك فلتر على اسم الحالة
      includeOptions[2].where = { statu: { [Op.like]: `%${status}%` } };
      includeOptions[2].required = true;
    }

    // product filtering:
    if (product_id !== undefined && product_id !== null) {
      // case: match ALL (إذا أرسلت مصفوفة وطلعت product_match === 'all')
      if (Array.isArray(product_id) && product_id.length > 0 && product_match === "all") {
        // نجيب كل الـ orders اللي تحتوي كل الـ product ids
        const matched = await OrderDetail.findAll({
          attributes: ['order_uuid'],
          where: { product_id: { [Op.in]: product_id } },
          group: ['order_uuid'],
          having: Sequelize.literal(`COUNT(DISTINCT product_id) = ${product_id.length}`),
          raw: true
        });

        const matchedOrderUuids = matched.map(r => r.order_uuid);
        if (matchedOrderUuids.length === 0) {
          return res.status(200).json({ orders: [], total: 0, currentPage: page, totalPages: 0 });
        }
        where.uuid = { [Op.in]: matchedOrderUuids };
      } else {
        // أي-match (any of the provided ids) أو single id
        const prodWhere = Array.isArray(product_id) ? { product_id: { [Op.in]: product_id } } : { product_id };
        includeOptions.push({
          model: OrderDetail,
          as: "order_details",   // عدّل الـ alias إذا عندك alias مختلف في associations
          attributes: [],        // لو بدك تفاصيل من الـ order_details حط الحقول هون
          where: prodWhere,
          required: true
        });
      }
    }

    const queryOptions = {
      where,
      include: includeOptions,
      order,
      limit,
      offset,
      subQuery: false,
      distinct: true
    };

    const { count, rows } = await Order.findAndCountAll(queryOptions);

    return res.status(200).json({
      orders: rows,
      total: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ============== SEARCH IN ORDERS ==================
exports.searchinorders2 = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      orderby,
      id,
      user_id,
      address_id,
      status_id,
      status,
      order_date,
      order_date_dir = "eq",
      total_amount,
      total_amound_currency,
      total_amount_dir = "eq",
      total_amount_paid,
      total_amount_paid_dir = "eq",
      total_amound_paid_currency,
      soft_deleted,
      note,
      product_id,
      product_match,
      q, // optional generic search query
    } = req.body;

    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;

    const order = orderOrderByMap[orderby] || orderOrderByMap["created-desc"];

    let where = {};
    if (id) where.uuid = id;
    if (user_id) where.user_id = user_id;
    if (address_id) where.shipping_address_id = address_id;
    if (status_id) where.status_id = status_id;
    if (soft_deleted !== undefined) where.soft_deleted = soft_deleted;

    // fuzzy search fields
    if (note) where.note = { [Op.like]: `%${note}%` };
    if (q) {
      // generic search across note and maybe more (expand as needed)
      where[Op.or] = [
        { note: { [Op.like]: `%${q}%` } },
        // add more searchable fields here if needed
      ];
    }

    // order_date filter
    if (order_date !== undefined) {
      switch (order_date_dir) {
        case "eq": where.order_date = { [Op.eq]: order_date }; break;
        case "gte": where.order_date = { [Op.gte]: order_date }; break;
        case "lte": where.order_date = { [Op.lte]: order_date }; break;
        case "gt": where.order_date = { [Op.gt]: order_date }; break;
        case "lt": where.order_date = { [Op.lt]: order_date }; break;
        default: where.order_date = { [Op.eq]: order_date }; break;
      }
    }

    const rawConditions = [];

    // same JSON filters as in filterorders
    if (total_amount !== undefined && total_amound_currency) {
      const sanitizedAmount = Number(total_amount);
      const currency = String(total_amound_currency).replace(/'/g, "''");
      const cmp = (() => {
        switch (String(total_amount_dir)) {
          case "gte": return `>= ${sanitizedAmount}`;
          case "lte": return `<= ${sanitizedAmount}`;
          case "gt": return `> ${sanitizedAmount}`;
          case "lt": return `< ${sanitizedAmount}`;
          case "eq":
          default: return `= ${sanitizedAmount}`;
        }
      })();
      rawConditions.push(
        `EXISTS (
          SELECT 1 FROM JSON_TABLE(total_amount, '$[*]' 
            COLUMNS(currency VARCHAR(64) PATH '$.currency', amount DECIMAL(65,6) PATH '$.amount')
          ) AS jt WHERE jt.currency = '${currency}' AND jt.amount ${cmp}
        )`
      );
    }

    if (total_amount_paid !== undefined && total_amound_paid_currency) {
      const sanitizedAmountPaid = Number(total_amount_paid);
      const currencyPaid = String(total_amound_paid_currency).replace(/'/g, "''");
      const cmpPaid = (() => {
        switch (String(total_amount_paid_dir)) {
          case "gte": return `>= ${sanitizedAmountPaid}`;
          case "lte": return `<= ${sanitizedAmountPaid}`;
          case "gt": return `> ${sanitizedAmountPaid}`;
          case "lt": return `< ${sanitizedAmountPaid}`;
          case "eq":
          default: return `= ${sanitizedAmountPaid}`;
        }
      })();
      rawConditions.push(
        `EXISTS (
          SELECT 1 FROM JSON_TABLE(total_amount_paid, '$[*]' 
            COLUMNS(currency VARCHAR(64) PATH '$.currency', amount DECIMAL(65,6) PATH '$.amount')
          ) AS jt2 WHERE jt2.currency = '${currencyPaid}' AND jt2.amount ${cmpPaid}
        )`
      );
    }

    if (rawConditions.length > 0) {
      where[Op.and] = rawConditions.map(cond => Sequelize.literal(cond));
    }

    // include options
    const includeOptions = [
      { model: User, attributes: ["uuid", "username", "phone_number"] },
      { model: Address, attributes: ["id", "name", "cost"] },
      { model: Order_statu, attributes: ["id", "statu"] },
    ];

    if (status) {
      includeOptions[2].where = { statu: { [Op.like]: `%${status}%` } };
      includeOptions[2].required = true;
    }

    // product filters same as filterorders
    if (product_id !== undefined && product_id !== null) {
      if (Array.isArray(product_id) && product_id.length > 0 && product_match === "all") {
        const matched = await OrderDetail.findAll({
          attributes: ['order_uuid'],
          where: { product_id: { [Op.in]: product_id } },
          group: ['order_uuid'],
          having: Sequelize.literal(`COUNT(DISTINCT product_id) = ${product_id.length}`),
          raw: true
        });

        const matchedOrderUuids = matched.map(r => r.order_uuid);
        if (matchedOrderUuids.length === 0) {
          return res.status(200).json({ orders: [], total: 0, currentPage: page, totalPages: 0 });
        }
        where.uuid = { [Op.in]: matchedOrderUuids };
      } else {
        const prodWhere = Array.isArray(product_id) ? { product_id: { [Op.in]: product_id } } : { product_id };
        includeOptions.push({
          model: OrderDetail,
          as: "order_details",
          attributes: [],
          where: prodWhere,
          required: true
        });
      }
    }

    const queryOptions = {
      where,
      include: includeOptions,
      order,
      limit,
      offset,
      subQuery: false,
      distinct: true
    };

    const { count, rows } = await Order.findAndCountAll(queryOptions);

    return res.status(200).json({
      orders: rows,
      total: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
