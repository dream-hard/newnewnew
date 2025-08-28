const {DB} =require('../config/config.js');
const sequlize = require('sequelize');
const {DataTypes}=sequlize;

const Image_type=DB.define("Image_type",{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true,
    },
    image_type:{
        type:DataTypes.STRING(30),
        allowNull:false,
        validate:{notEmpty:true}
    }
},
{freezeTableName:true,tableName:"image_types"});
module.exports=Image_type;