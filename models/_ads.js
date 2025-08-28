const sequlize = require('sequelize');
const {DB} =require('../config/config.js');
const {DataTypes}=sequlize;

const Ads=DB.define("Ads",{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        allowNull  :false,
        primaryKey:true,
        unique:true,
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    title:{
        type:DataTypes.STRING,
        allowNull:true,
        validate:{
            notEmpty:true,
        }
    },
    link_path:{
        type:DataTypes.STRING,
        allowNull:false,
        defaultValue:"/home",
    },
    photo_path:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            notNull:true,
            notEmpty:true,
        }
    },
    isvalid:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:0,   
    }
},  
{freezeTableName:true,timestamps:true,tableName:'Ads'});

module.exports=Ads;