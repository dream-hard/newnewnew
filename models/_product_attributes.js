const sequlize = require('sequelize');
const {DB} =require('../config/config.js');
const {DataTypes}=sequlize;
const Product = require('./_products.js');
const Attribute_option = require('./_attribute_options.js');

const Product_attribute=DB.define("Product_attribute",{
    id:{
        type:DataTypes.INTEGER,
        unique:true,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    product_id:{
        type:DataTypes.UUID,
        allowNull:false,
        references:{
            model:"products",
            key:"uuid"
        },
        onDelete: 'CASCADE',
            onUpdate:"CASCADE",
    },
    attribute_option_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        validate:{
            notEmpty:true,
            notNull:true,
        },
        references:{
            model:"attribute_options",
            key:"id"
        },
        onDelete: 'CASCADE',
            onUpdate:"CASCADE",
    },
    is_filteractive:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:true,
    }

},{freezeTableName:true,tableName:"product_attributes"})

module.exports=Product_attribute;