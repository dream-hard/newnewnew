const sequlize = require('sequelize');
const {DB} =require('../config/config.js');
const {DataTypes}=sequlize;

const Category=DB.define("Category",{
    uuid:{
        type:DataTypes.UUID,
        defaultValue:DataTypes.UUIDV4,

        allowNull  :false,
        primaryKey:true,
        unique:true,
        validate:{
            notEmpty:true,
            notNull:true,
        }
    },
    parent_category_id:{
        type:DataTypes.UUID,
        allowNull:true,
        
        references:{
            model:"categories",
            key:"uuid"
        }
    },
    display_name:{
        type:DataTypes.STRING,
        allowNull:false,
        defaultValue:""
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    slug:{
        type:DataTypes.STRING,
        unique:true,
        allowNull:false,
        validate:{
            notEmpty:true,
            notNull:true,

        }
    },
    description:{
        type:DataTypes.TEXT,
        allowNull:true,

    },
    softdelete:{
        type:DataTypes.BOOLEAN,
        defaultValue:false,
        allowNull:false
    }
},  
{freezeTableName:true,timestamps:true,tableName:'categories'});

module.exports=Category;