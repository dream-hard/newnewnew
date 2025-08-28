const {DB} =require('../config/config.js');
const sequlize = require('sequelize');
const {DataTypes}=sequlize;

const Role=DB.define('Role',{
    uuid:{
        type:DataTypes.STRING(30),
        unique:true,
        allowNull:false,
        primaryKey:true,

        validate:{
            notEmpty:true,
            notNull:true,
        }
    }
    ,kind:{
        type:DataTypes.ENUM,
        values:['status','role'],
        allowNull:false,
        validate:{
            notEmpty:true,
            notNull:true,

        }
    }

},
{freezeTableName:true,timestamps:true,tableName:"Roles"});
Role.role_types=['status','role'];

module.exports=Role;