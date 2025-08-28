const {DB} =require('../config/config.js');
const sequlize = require('sequelize');
const {DataTypes}=sequlize;
const Category = require('./_categories.js');
const Attribute_option = require('./_attribute_options.js');

const Category_attribute=DB.define("Category_attribute",{
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
    category_id:{
        type:DataTypes.UUID,
        allowNull:true,
        
        references:{
            model:"categories",
            key:"uuid"
        }
    },
    attribute_option_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:"attribute_options",
            key:'id'
        }
    },
    isfilterable:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:true,
        
    }
},  
{freezeTableName:true,tableName:'category_attributes'});

module.exports=Category_attribute;