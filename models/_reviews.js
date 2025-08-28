const sequlize = require('sequelize');
const {DB} =require('../config/config.js');
const {DataTypes}=sequlize;


const Review=DB.define("Review",{
    user_id:{
        type:DataTypes.UUID,
        allowNull:false,
        references:{
            model:"users",
            key:"uuid"
        }
    },
    product_id:{
        type:DataTypes.UUID,
        allowNull:false,
        references:{
            model:"products",
            key:"uuid"
        }

    },
    rating:{
        type:DataTypes.INTEGER,
        allowNull:false,
        validate:{
            notEmpty:true,
            min:1,
            max:5
        },

    },
    review:{
        type:DataTypes.TEXT,
        allowNull:true,

    },
    status:{
        type:DataTypes.ENUM,
        values:['pending','allowed','declined'],
        allowNull:false,
        validate:{
            isIn:[['pending','allowed','diclined']]
        }
    },
    isactive:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:true,

    },

},{timestamps:true,freezeTableName:true,tableName:"reviews"});

module.exports=Review