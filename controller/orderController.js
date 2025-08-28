const { Order, Order_detail, Address, User, Shipping, Order_statu, Exchange_rate, Supplier_shipment_detail, Product } = require("../models/index.js");



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
    const deleted = await Order.destroy({ where: { uuid: req.body.id } });
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
  const { user_id, address_id, custom_address } = req.body;
  const { phoneNumber, shipping_address, products, note ,currency} = req.body;
  let total_amount=[];
  
  try {
    let total =0;
    for (const item of products){
            total += item.price * item.quantity;
    }
    total_amount.push({amount:total,currency:currency});

    if (!phone || !products || products.length === 0) {
        return res.status(400).json({ error: "Phone number and products are required" });
    }
    let user = await User.findOne({ where: { phone_number:phoneNumber } });
    let hashpassword=hashPassword("null");
        if (!user) {
            // Create guest user
            user = await User.create({
                phone_number:phoneNumber,
                username: "guest_" + phoneNumber,
                name:`${phoneNumber}`,
                role_id:"geust_user",
                status_id:"pending",
                passwordhash:hashpassword,
                bio:"i am auto genrated account",


            });
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
    const order = await Order.create({
      user_id:user.uuid,
      shipping_address_id, 
      note: final_note,
      status_id: 1, // Pending
      total_amount,
      total_amound_paid:[],

    });

      // the price of each product: the main total_amount_paid or the total amount currency is that and for now it is attached to it 
    const orderDetails = products.map(p => ({
      order_id: order.uuid,
      product_id: p.product_id,
      quantity: p.quantity,
      cost_per_one: p.cost_per_one,
      currency:currency,
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
        
      if(order_statu==="pending")//pending
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
        [order_update]=await order.update({status_id:status_id});
        return res.status(200).json({success:true,msg:"تم إالغاء الطلب بنجاح من دون الإذالة كليا"});
        }else{
        [order_update]=await order.update({status_id:status_id});
        cancel = await order.destroy();
        return res.status(200).json({success:true,msg:"تم إالغاء الطلب بنجاح مع الإذالة كليا"});
 
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
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
};

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