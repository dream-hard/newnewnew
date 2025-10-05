const sequlize= require('sequelize');
const {DB} =require('../config/config.js');
const Role = require('./_role.js');
const {DataTypes}=sequlize;


const User=DB.define('User',{
    uuid:{
        type:DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull:false,
        primaryKey:true,
        
        validate:{
            notEmpty:true,
            notNull:true,
            
        }
    }
    ,name:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            notEmpty:true,
            notNull:true,
        }
    }
    ,email:{
        type:DataTypes.STRING,
        unique:true,
        allowNull:true,
 
    },
    passwordhash:{
        type:DataTypes.STRING,
        allowNull:false,
          allowNull:false,
        validate:{
            notEmpty:true,
            notNull:true,

        }

    },
    username:{
        type:DataTypes.STRING,
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
    bio:{
        type:DataTypes.TEXT,
        validate:{
            notEmpty:false,
            notNull:false,
        }
    }
    ,role_id:{
        type:DataTypes.STRING(20),
        allowNull:false,
        validate:{
            notEmpty:true,
            notNull:true,   
        },
        references:{
            model:"roles",
            key:"uuid"
        }
    }
    ,status_id:{
          type:DataTypes.STRING(20),
        allowNull:false,
        validate:{
            notEmpty:true,
            notNull:true,   
        }
        ,  references:{
            model:"roles",
            key:"uuid"
        },
        onDelete: 'CASCADE',
        onUpdate:"CASCADE",
    }
    ,Profile_pic:{
        type:DataTypes.STRING,
        allowNull:true,
    }
    
},{freezeTableName: true, timestamps: true,tableName:"users"});

module.exports=User;