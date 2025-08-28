const sequlize = require('sequelize');
const {DB} =require('../config/config.js');
const {DataTypes}=sequlize;
const Product = require('./_products.js');

const Product_image=DB.define("Product_image",{
    id:{
        type:DataTypes.INTEGER,
        unique:true,
        primaryKey:true,
        autoIncrement:true,
    },
    product_id:{
        type:DataTypes.UUID,
        allowNull:false,
        references:{
            model:"products",
            key:"uuid"
        }
    },
    image_type:{
        type:DataTypes.ENUM("main","sup"),
        allowNull:false,
        validate:{
            isIn:[['main','sup']],
            notEmpty:true,
        }
    } ,
    filename:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true,
    },
    disk_filename:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true,
    }

},{timestamps:true,freezeTableName:true,tableName:"product_images"});
Product_image.image_type_values=['main','sup'];

module.exports=Product_image;