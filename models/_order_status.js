const sequlize = require('sequelize');
const {DB} =require('../config/config.js');
const {DataTypes}=sequlize;

const Order_statu=DB.define('Order_statu',{
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
{freezeTableName:true,tableName:"order_status"}
)
module.exports=Order_statu;