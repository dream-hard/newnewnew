const sequlize = require('sequelize');
const {DB} =require('../config/config.js');
const {DataTypes}=sequlize;
const Prodcut = require('./_products.js');

const Coupon=DB.define("Coupon",{
    code:{
        type:DataTypes.STRING,
        unique:true,
        allowNull:false,
        primaryKey:true,

    },
    product_id:{
        type:DataTypes.UUID,
        allowNull:true,
        references:{
         model:"products",
         key:'uuid'   
        },
        onDelete: 'CASCADE',
        onUpdate:"CASCADE",
    },
    discounttype:{
        type:DataTypes.ENUM,
        values:['percent','origin'],
        validate:{
            isIn:[['percent','origin']]
        }

    },
    discount_value:{
        type:DataTypes.INTEGER,
        allowNull:true,
        defaultValue:0,
        validate: {
            min: 0
        }
    },
    usage_limit:{
        type:DataTypes.INTEGER,
        allowNull:false,

    },
    usage_count:{
        type:DataTypes.INTEGER,
        defaultValue:0,
        allowNull:false,
           validate: {
      min: 0
    }
    },
    start_date:{
        type:DataTypes.DATEONLY,
        allowNull:false,
        validate:{
            notEmpty:true,
            isDate:true,
        }
    },
    end_date:{
        type:DataTypes.DATEONLY,
        allowNull:false,
        validate:{
            notEmpty:true,
            isDate:true,
        }
    },
    isactive:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:true,
    }
},  
{freezeTableName:true,tableName:'coupons'});

module.exports=Coupon;