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

////////////////////////////////////////

Address.hasMany(Address, {
    as: 'Children',
    foreignKey: 'parent_id'
});

Address.belongsTo(Address, {
    as: 'Parent',
    foreignKey: 'parent_id'
});
//////////////////////////////////////

User.belongsTo(Role, {
  foreignKey: 'role_id',
  as: 'Role'
});

User.belongsTo(Role, {
  foreignKey: 'status_id',
  as: 'Status'
});
Role.hasMany(User, { foreignKey: 'role_id', as: 'UsersWithRole' });
Role.hasMany(User, { foreignKey: 'status_id', as: 'UsersWithStatus' });
/////////////////////////////////////////////
User.hasMany(User_coupon, { foreignKey: 'user_id', as: 'UserCoupons' });
User_coupon.belongsTo(User, { foreignKey: 'user_id', as: 'User' });

Coupon.hasMany(User_coupon, { foreignKey: 'coupon_id', as: 'CouponUsers' });
User_coupon.belongsTo(Coupon, { foreignKey: 'coupon_id', as: 'Coupon' });

User.belongsToMany(Coupon, { through: User_coupon, foreignKey: 'user_id', otherKey: 'coupon_id', as: 'Coupons' });
Coupon.belongsToMany(User, { through: User_coupon, foreignKey: 'coupon_id', otherKey: 'user_id', as: 'Users' });
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
  as: 'ParentCategory'
});

Category.hasMany(Category, {
  foreignKey: 'parent_category_id',
  as: 'Subcategories'
});
////////////////////////////////////////////////////
// Category → Category_attribute
Category.hasMany(Category_attribute, { foreignKey: 'category_id', as: 'CategoryAttributes' });
Category_attribute.belongsTo(Category, { foreignKey: 'category_id', as: 'Category' });

// Attribute_option → Category_attribute
Attribute_option.hasMany(Category_attribute, { foreignKey: 'attribute_option_id', as: 'OptionCategories' });
Category_attribute.belongsTo(Attribute_option, { foreignKey: 'attribute_option_id', as: 'AttributeOption' });
///////////////////////////////////////////////////////////////

Supplier.hasMany(Supplier_shipment, { foreignKey: 'supplier_id', as: 'Shipments' });
Supplier_shipment.belongsTo(Supplier, { foreignKey: 'supplier_id', as: 'Supplier' });
////////////////////////////////////////////////////////
Supplier_shipment.hasMany(Supplier_shipment_detail, { foreignKey: 'supplier_shipment_id', as: 'ShipmentDetails' });
Supplier_shipment_detail.belongsTo(Supplier_shipment, { foreignKey: 'supplier_shipment_id', as: 'SupplierShipment' });

Product.hasMany(Supplier_shipment_detail, { foreignKey: 'product_id', as: 'ShipmentDetails' });
Supplier_shipment_detail.belongsTo(Product, { foreignKey: 'product_id', as: 'Product' });
//////////////////////////////////////////////////////////////////////
Shipping.belongsTo(Shipping_method, { foreignKey: 'type', as: 'ShippingMethod' });
Shipping_method.hasMany(Shipping, { foreignKey: 'type', as: 'Shippings' });

/////////////////////////////////////////////////////
Review.belongsTo(User, { foreignKey: 'user_id', as: 'User' });
User.hasMany(Review, { foreignKey: 'user_id', as: 'Reviews' });

Review.belongsTo(Product, { foreignKey: 'product_id', as: 'Product' });
Product.hasMany(Review, { foreignKey: 'product_id', as: 'Reviews' });
/////////////////////////////////////////////////////////
Product.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Product, { foreignKey: 'user_id' });

Product.belongsTo(Category, { foreignKey: 'category_id' });
Category.hasMany(Product, { foreignKey: 'category_id' });

Product.belongsTo(Product_statu, { foreignKey: 'status_id' });
Product_statu.hasMany(Product, { foreignKey: 'status_id' });

Product.belongsTo(Product_condition, { foreignKey: 'condition_id' });
Product_condition.hasMany(Product, { foreignKey: 'condition_id' });

Product.belongsTo(Currency, { foreignKey: 'currency_id' });
Currency.hasMany(Product, { foreignKey: 'currency_id' });
////////////////////////////////////////////////////
Product.hasMany(Product_image, { foreignKey: 'product_id', });
Product_image.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
/////////////////////////////////////////////////
Product_attribute.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
Product.hasMany(Product_attribute, { foreignKey: 'product_id',  });
Product_attribute.belongsTo(Attribute_option, { foreignKey: 'attribute_option_id', });
Attribute_option.hasMany(Product_attribute, { foreignKey: 'attribute_option_id', as: 'productAttributes' });
///////////////////////////////////////////////////////
User.hasMany(Order, { foreignKey: 'user_id', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Address.hasMany(Order, { foreignKey: 'shipping_address_id', as: 'orders' });
Order.belongsTo(Address, { foreignKey: 'shipping_address_id', as: 'shipping_address' });

Order_statu.hasMany(Order, { foreignKey: 'status_id', as: 'orders' });
Order.belongsTo(Order_statu, { foreignKey: 'status_id', as: 'status' });
////////////////////////////////////////////////////////////////
Order.hasMany(Order_detail, { foreignKey: 'order_id', as: 'order_details' });
Order_detail.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

Product.hasMany(Order_detail, { foreignKey: 'product_id', as: 'order_details' });
Order_detail.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
////////////////////////////////////////////////////////////////////////
Currency.hasMany(Exchange_rate, { foreignKey: 'base_currency_id', as: 'base_exchange_rates' });
Currency.hasMany(Exchange_rate, { foreignKey: 'target_currency_id', as: 'target_exchange_rates' });

Exchange_rate.belongsTo(Currency, { foreignKey: 'base_currency_id', as: 'base_currency' });
Exchange_rate.belongsTo(Currency, { foreignKey: 'target_currency_id', as: 'target_currency' });
////////////////////////////////////////////////////////////////
Product.hasMany(Coupon, { foreignKey: 'product_id' });
Coupon.belongsTo(Product, { foreignKey: 'product_id' });
//////////////////////////////////////////////

Order.hasOne(Shipping,{foreignKey:"order_id",as:"order"});
Shipping.belongsTo(Order,{foreignKey:"order_id",as:'order'});



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
  Ads
};



module.exports = models;
