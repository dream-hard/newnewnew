const sequlize = require('sequelize');
const {DB} =require('../config/config.js');
const {DataTypes}=sequlize;

const Product_statu=DB.define('Product_statu',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false,

    },
    statu:{
        type:DataTypes.STRING(30),
        allowNull:false,
        unique:true,
       validate:{
        notEmpty:true,
        notNull:true,

       } 
    }
},
{freezeTableName:true,tableName:"product_status"}
)
module.exports=Product_statu;