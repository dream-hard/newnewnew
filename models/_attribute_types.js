const sequlize = require('sequelize');
const {DB} =require('../config/config.js');
const {DataTypes}=sequlize;

const Attribute_type=DB.define("Attribute_type",{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        allowNull  :false,
        primaryKey:true,
        unique:true,
        validate:{
            notEmpty:true,
            notNull:true,
        }
    },
    name:{
        type:DataTypes.STRING(30),
        unique:true,
        allowNull:false,
    },
    
},  
{freezeTableName:true,tableName:'attribute_types'});

module.exports=Attribute_type;