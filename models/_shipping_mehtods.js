const sequlize= require('sequelize');
const {DB} =require('../config/config.js');
const Supplier = require('./_suppliers.js');
const {DataTypes}=sequlize;

const Shipping_method= DB.define('Shipping_method',
  {
    id:{
       type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            notEmpty:true,

        }
    } 
    ,cost:{
        type:DataTypes.DECIMAL(10,2),
        allowNull:true,
    }
    
  }
    ,{freezeTableName:true,timestamps:true,tableName:"shipping_methods"})

    module.exports=Shipping_method;