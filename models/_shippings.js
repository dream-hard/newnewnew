const sequlize= require('sequelize');
const {DB} =require('../config/config.js');
const Supplier = require('./_suppliers.js');
const Shipping_method = require('./_shipping_mehtods.js');
const {DataTypes}=sequlize;

const Shipping= DB.define('Shipping',
  {
    id:{
       type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    },
    
    order_id:{
        type:DataTypes.UUID,
        allowNull:false,
        validate:{
            notEmpty:true,
            notNull:true,
        },
         references:{
            model:"orders",
            key:"uuid"
        }
    },

    type:{
        type:DataTypes.INTEGER,
        allowNull:true,
        references:{
            model:"shipping_methods",
            key:"id"
        },
            onUpdate:"CASCADE",
    },tracknumber:{
        type:DataTypes.STRING(50),
        unique:true,
    },
    cost:{
        type: DataTypes.DECIMAL(20, 10), 
        allowNull:true,
    },
    shipping_date:{
            type:DataTypes.DATEONLY,
            allowNull:true,


    }
    ,dlivered_date:{
            type:DataTypes.DATEONLY,
            allowNull:true,

    },
    note:{
        type:DataTypes.TEXT,
        allowNull:true,
    }
  }
    ,{freezeTableName:true,timestamps:true,tableName:"shippings"})

    module.exports=Shipping;