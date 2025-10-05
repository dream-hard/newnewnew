const Sequelize=require ('sequelize');
const {DB}=require('../config/config');


const User = require('./_User');
const Product = require('./_products');
const Product_image = require('./_product_images');
const Product_attribute = require('./_product_attributes');
const Product_condition = require('./_product_conditoins');
const Product_statu = require('./_product_status');
const Address = require('./_adderss');
const Attribute_option = require('./_attribute_options');
const Attribute_type = require('./_attribute_types');
const Category = require('./_categories');
const Category_attribute = require('./_categroy_attributes');
const Coupon = require('./_coupons');
const Currency = require('./_currencies');
const Exchange_rate = require('./_exchange_rates');
const Image_type = require('./_image_types');//////////////////////
const Order_detail = require('./_order_details');
const Order_statu = require('./_order_status');/////////////////////////////
const Order = require('./_orders');
const Review = require('./_reviews');
const Role = require('./_role');///////////////////////
const Shipping_method = require('./_shipping_mehtods');
const Shipping = require('./_shippings');
const User_coupon = require('./_user_coupons');
const Supplier = require('./_suppliers');
const Supplier_shipment = require('./_supplier_shipment');
const Supplier_shipment_detail = require('./_supplier_shipment_details');
const Ads = require('./_ads');
const CourseDetails = require('./course_details');
const UsedDetails = require('./used_details');
const ServiceDetails = require('./service_details');

////////////////////////////////////////

Address.hasMany(Address, {
    foreignKey: 'parent_id'
});

Address.belongsTo(Address, {

    foreignKey: 'parent_id'
});
//////////////////////////////////////

User.belongsTo(Role, {
  foreignKey: 'role_id',
});

User.belongsTo(Role, {
  foreignKey: 'status_id',
});
Role.hasMany(User, { foreignKey: 'role_id' });
Role.hasMany(User, { foreignKey: 'status_id' });
/////////////////////////////////////////////
User.hasMany(User_coupon, { foreignKey: 'user_id' });
User_coupon.belongsTo(User, { foreignKey: 'user_id' });

Coupon.hasMany(User_coupon, { foreignKey: 'coupon_id' });
User_coupon.belongsTo(Coupon, { foreignKey: 'coupon_id' });

User.belongsToMany(Coupon, { through: User_coupon, foreignKey: 'user_id', otherKey: 'coupon_id' });
Coupon.belongsToMany(User, { through: User_coupon, foreignKey: 'coupon_id', otherKey: 'user_id' });
////////////////////////////////////////////////////

Attribute_option.belongsTo(Attribute_type, {
  foreignKey: 'attribute_type_id',
  
});
Attribute_type.hasMany(Attribute_option, {
  foreignKey: 'attribute_type_id',
  
});
//////////////////////////////////////////////////
Category.belongsTo(Category, {
  foreignKey: 'parent_category_id',
});

Category.hasMany(Category, {
  foreignKey: 'parent_category_id',

});
////////////////////////////////////////////////////
// Category → Category_attribute
Category.hasMany(Category_attribute, { foreignKey: 'category_id' });
Category_attribute.belongsTo(Category, { foreignKey: 'category_id' });

// Attribute_option → Category_attribute
Attribute_option.hasMany(Category_attribute, { foreignKey: 'attribute_option_id' });
Category_attribute.belongsTo(Attribute_option, { foreignKey: 'attribute_option_id' });
///////////////////////////////////////////////////////////////

Supplier.hasMany(Supplier_shipment, { foreignKey: 'supplier_id' });
Supplier_shipment.belongsTo(Supplier, { foreignKey: 'supplier_id' });
////////////////////////////////////////////////////////
Supplier_shipment.hasMany(Supplier_shipment_detail, { foreignKey: 'supplier_shipment_id' });
Supplier_shipment_detail.belongsTo(Supplier_shipment, { foreignKey: 'supplier_shipment_id' });

Product.hasMany(Supplier_shipment_detail, { foreignKey: 'product_id' });
Supplier_shipment_detail.belongsTo(Product, { foreignKey: 'product_id' });
//////////////////////////////////////////////////////////////////////
Shipping.belongsTo(Shipping_method, { foreignKey: 'type' });
Shipping_method.hasMany(Shipping, { foreignKey: 'type' });

/////////////////////////////////////////////////////
Review.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Review, { foreignKey: 'user_id' });

Review.belongsTo(Product, { foreignKey: 'product_id' });
Product.hasMany(Review, { foreignKey: 'product_id' });
/////////////////////////////////////////////////////////
Product.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Product, { foreignKey: 'user_id' });

Product.belongsTo(Category, { foreignKey: 'category_id' });
Category.hasMany(Product, { foreignKey: 'category_id' });

Product.belongsTo(Product_statu, { foreignKey: 'status_id' });
Product_statu.hasMany(Product, { foreignKey: 'status_id' });

Product.belongsTo(Product_condition, { foreignKey: 'condition_id' });
Product_condition.hasMany(Product, { foreignKey: 'condition_id' });

Product.belongsTo(Currency, { foreignKey: 'currency_id' ,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",});
Currency.hasMany(Product, { foreignKey: 'currency_id',
    onDelete: "CASCADE",
    onUpdate: "CASCADE", });
////////////////////////////////////////////////////
Product.hasMany(Product_image, { foreignKey: 'product_id', });
Product_image.belongsTo(Product, { foreignKey: 'product_id'});
/////////////////////////////////////////////////
Product_attribute.belongsTo(Product, { foreignKey: 'product_id' });
Product.hasMany(Product_attribute, { foreignKey: 'product_id',  });
Product_attribute.belongsTo(Attribute_option, { foreignKey: 'attribute_option_id', });
Attribute_option.hasMany(Product_attribute, { foreignKey: 'attribute_option_id' });
///////////////////////////////////////////////////////
User.hasMany(Order, { foreignKey: 'user_id' });
Order.belongsTo(User, { foreignKey: 'user_id' });

Address.hasMany(Order, { foreignKey: 'shipping_address_id' });
Order.belongsTo(Address, { foreignKey: 'shipping_address_id' });

Order_statu.hasMany(Order, { foreignKey: 'status_id' });
Order.belongsTo(Order_statu, { foreignKey: 'status_id' });
////////////////////////////////////////////////////////////////
Order.hasMany(Order_detail, { foreignKey: 'order_id' });
Order_detail.belongsTo(Order, { foreignKey: 'order_id' });

Product.hasMany(Order_detail, { foreignKey: 'product_id' ,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",});
Order_detail.belongsTo(Product, { foreignKey: 'product_id',
    onDelete: "CASCADE",
    onUpdate: "CASCADE", });
////////////////////////////////////////////////////////////////////////
  Currency.hasMany(Exchange_rate, {
    foreignKey: "base_currency_id",
    sourceKey: "currency_iso",
    as: "baseCurrency",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // و many exchange rates كـ target
  Currency.hasMany(Exchange_rate, {
    foreignKey: "target_currency_id",
    sourceKey: "currency_iso",
    as: "targetRates",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Exchange_rate.belongsTo(Currency, {
    foreignKey: "base_currency_id",
    targetKey: "currency_iso",   // Currency.currency_iso هو الـ PK عندك
    as: "baseCurrency",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // ربط إلى Currency كـ targetCurrency
  Exchange_rate.belongsTo(Currency, {
    foreignKey: "target_currency_id",
    targetKey: "currency_iso",
    as: "targetCurrency",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
////////////////////////////////////////////////////////////////
Product.hasMany(Coupon, { foreignKey: 'product_id' });
Coupon.belongsTo(Product, { foreignKey: 'product_id' });
//////////////////////////////////////////////

Order.hasOne(Shipping,{foreignKey:"order_id"});
Shipping.belongsTo(Order,{foreignKey:"order_id"});

/////////////////////////////////////////////////////////////
Product.hasOne(CourseDetails, { foreignKey: 'product_id' });
CourseDetails.belongsTo(Product, { foreignKey: 'product_id' });

Product.hasOne(UsedDetails, { foreignKey: 'product_id' });
UsedDetails.belongsTo(Product, { foreignKey: 'product_id' });

Product.hasOne(ServiceDetails, { foreignKey: 'product_id' });
ServiceDetails.belongsTo(Product, { foreignKey: 'product_id' });



const models = {
  User,
  Product,
  Product_image,
  Product_attribute,
  Product_condition,
  Product_statu,
  Address,
  Attribute_option,
  Attribute_type,
  Category,
  Category_attribute,
  Coupon,
  Currency,
  Exchange_rate,
  Image_type,
  Order_detail,
  Order_statu,
  Order,
  Review,
  Role,
  Shipping_method,
  Shipping,
  User_coupon,
  Supplier,
  Supplier_shipment,
  Supplier_shipment_detail,
  Ads,
  CourseDetails,
  UsedDetails,
  ServiceDetails
};



module.exports = models;
