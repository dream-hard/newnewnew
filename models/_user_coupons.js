const {DB} =require('../config/config.js');
const sequlize= require('sequelize');

const {DataTypes}=sequlize;
const User = require('./_User.js');
const Coupon = require('./_coupons.js');

const User_coupon=DB.define("User_coupon",
    {
        user_id:{
            type:DataTypes.UUID,
            allowNull:false,
            references:{
                model:"users",
                key:"uuid"
            }
        },
        coupon_id:{
            type:DataTypes.STRING,
            allowNull:false,
            references:{
                model:"coupons",
                key:'code'
            }
        },
        usage_count:{
            type:DataTypes.INTEGER,
            allowNull:false,
            defaultValue:1,
            validate:{
                notEmpty:true,
                notNull:true,
            }
        }


    }
    
    ,{freezeTableName:true,timestamps:true,tableName:"user_coupons"})

module.exports=User_coupon;