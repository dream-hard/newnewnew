const sequlize = require('sequelize');
const {DB} =require('../config/config.js');
const {DataTypes}=sequlize;

const Order_detail=DB.define("Order_detail",{
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
    order_id:{
        type:DataTypes.UUID,
        allowNull:false,
        references:{
            model:"orders",
            key:"uuid"
        },
        onDelete: 'CASCADE',
        onUpdate:"CASCADE",
        
    },
    product_id:{
        type:DataTypes.UUID,
        allowNull:false,
        references:{
            model:"products",
            key:"uuid"
        },
        onDelete: 'CASCADE',
        onUpdate:"CASCADE",
    },
    note:{
        type:DataTypes.STRING,
        allowNull:true,
    },
    softdeleted:{
        type:DataTypes.BOOLEAN,
        allowNull:true,
        defaultValue:false,

        
    },
    quantity:{
        type:DataTypes.INTEGER,
        allowNull:false,
        defaultValue:1,
        validate:{
            min:1
        }

    },
    cost_per_one:{
        type:DataTypes.DECIMAL,
        allowNull:false,

    },
    currency: {
    type: DataTypes.STRING(3), // e.g., 'USD', 'EUR'
    allowNull: true,
    defaultValue:null,
    validate: {
        len: [3, 3],
    }
},  
},{freezeTableName:true,tableName:'order_details'});

module.exports=Order_detail;