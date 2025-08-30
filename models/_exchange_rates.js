const sequlize = require('sequelize');
const {DB} =require('../config/config.js');
const {DataTypes,Sequelize}=sequlize;
const Currency = require('./_currencies.js');

const Exchange_rate=DB.define("Exchange_rate",{
    base_currency_id:{
        type:DataTypes.CHAR(3),
        allowNull:false,
        primaryKey:true,
        validate:{
            notNull:true,
             len:[3,3]
       },
          references:{
            model:"currencies",
            key:"currency_iso"
        }
    },
    target_currency_id:{
        type:DataTypes.CHAR(3),
        allowNull:false,
        primaryKey:true,
        validate:{
            notNull:true,
            len:[3,3]
        },
        references:{
            model:"currencies",
            key:"currency_iso"
        }
    },
    exchange_rate:{
        type: DataTypes.DECIMAL(15,8),
        allowNull:false,
        validate:{
            notEmpty:true,
            notNull:true,
        }
    }
    ,dateofstart:{
        type:DataTypes.DATEONLY,
        allowNull:false,
          defaultValue:  new Date()      ,  // or some valid date

        validate:{
            notEmpty:true,
            notNull:true
        }
    }
},
{freezeTableName:true,timestamps:true,tableName:'exchange_rates'});

module.exports=Exchange_rate;