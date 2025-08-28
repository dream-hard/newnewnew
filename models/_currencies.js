const sequlize = require('sequelize');
const {DB} =require('../config/config.js');
const {DataTypes}=sequlize;

const Currency=DB.define("Currency",{
    currency_iso:{
        type:DataTypes.CHAR(3),
        allowNull  :false,
        primaryKey:true,
        unique:true,
        validate:{
            notNull:true,
              len:[3,3] 
             }
    },
    name:{
        type:DataTypes.STRING(30),
        unique:true,
        allowNull:false,
    },
    symbol:{
        type:DataTypes.CHAR(3),
        allowNull:false,
    }
},  
{freezeTableName:true,tableName:'currencies'});

module.exports=Currency;