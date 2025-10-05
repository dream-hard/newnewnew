const sequlize = require('sequelize');
const {DB} =require('../config/config.js');
const {DataTypes}=sequlize;
const Attribute_type = require('./_attribute_types.js');

const Attribute_option=DB.define("Attribute_option",{
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
    attribute_type_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        validate:{
            notEmpty:true,
            notNull:true

        },
        references:{
            model:"attribute_types",
            key:"id"
        },
        onDelete: 'CASCADE',
        onUpdate:"CASCADE",
    },
    name:{
        type:DataTypes.STRING(30),
        unique:true,
        allowNull:false,
        validate:{
            notEmpty:true,
        }
    },

},  
{freezeTableName:true,tableName:'attribute_options'});

module.exports=Attribute_option;