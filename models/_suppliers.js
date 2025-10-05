const sequlize= require('sequelize');
const {DB} =require('../config/config.js');
const {DataTypes}=sequlize;

const Supplier=DB.define('Supplier',{
    uuid:{
   type:DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,     
           unique:true,
        allowNull:false,
                primaryKey:true,

        validate:{
            notEmpty:true,
            notNull:true,
        }
    },
    name:{
        type:DataTypes.STRING(200),
        allowNull:false,
        validate:{
            notEmpty:true,
            notNull:true,

        }
    },
    phone_number:{
        type:DataTypes.STRING,
        unique:true,
        allowNull:false,
        validate:{
            is:/^\+?[0-9\s()-]{7,20}$/,
            notEmpty:true,
            notNull:true,
            
        }
    },
    address:{
        type:DataTypes.STRING(255),
        allowNull:false,
        validate:{
            notEmpty:false,
            notNull:false,
        }
    },
    metadata:{
        type:DataTypes.JSON,
        allowNull:true,
        validate:{
            notNull:false,
        }
    },

},
{freezeTableName:true,timestamps:true,tableName:'suppliers'});

module.exports=Supplier;