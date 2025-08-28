const sequlize = require('sequelize');
const {DB} =require('../config/config.js');
const {DataTypes}=sequlize;

const Address=DB.define("Address",{
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
        type:DataTypes.STRING,
        allowNull:false,
    },
    parent_id:{
        type:DataTypes.INTEGER,
        allowNull:true,
        references:{
            model:'addresses',
            key:"id"
        }
    },
    forfree:{
        type:DataTypes.BOOLEAN,
        allowNull:true,
        defaultValue:false,
    }
},  
{freezeTableName:true,tableName:'addresses'});

module.exports=Address;