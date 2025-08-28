const sequlize = require('sequelize');
const {DB} =require('../config/config.js');
const {DataTypes}=sequlize;

const Product_condition=DB.define('Product_condition',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false,

    },
    condition:{
        type:DataTypes.STRING(30),
        allowNull:false,
        unique:true,
       validate:{
        notEmpty:true,
        notNull:true,

       } 
    },
    percent:{
        type:DataTypes.DECIMAL(4,2),
        allowNull:false,
        validate:{
            min:0.00,
            max:100.00,
        }

    }
},
{freezeTableName:true,tableName:"product_conditions"}
)
module.exports=Product_condition;