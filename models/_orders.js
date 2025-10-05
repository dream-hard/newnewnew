const sequlize = require('sequelize');
const {DB} =require('../config/config.js');
const {DataTypes}=sequlize;
const User = require('./_User.js');
const Address = require('./_adderss.js');
const Order_statu = require('./_order_status.js');

const Order=DB.define('Order',{
    uuid:{
        type:DataTypes.UUID,
        primaryKey:true,
        allowNull:false,
        defaultValue:DataTypes.UUIDV4,
        validate:{
            notEmpty:true,
            notNull:true,
        }
    },
    user_id:{
        type:DataTypes.UUID,
        allowNull:false,
        references:{
            model:"users",
            key:"uuid"
        },
        onDelete: 'CASCADE',
            onUpdate:"CASCADE",
        validate:{
            notEmpty:true,
            notNull:true,
        }
    
    },
    shipping_address_id:{
        type:DataTypes.INTEGER,
        allowNull:true,
        references:{
            model:"addresses",
            key:"id"
        },
        onDelete: 'CASCADE',
        onUpdate:"CASCADE",
        
    },
    status_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        validate:{
            notEmpty:true,
            notNull:true,

        },
        references:{
            model:"order_status",
            key:"id",
        },
        onDelete: 'CASCADE',
        onUpdate:"CASCADE",
    },
    order_date:{
        type:DataTypes.DATE,
        defaultValue:DataTypes.NOW,
        allowNull:true,
        validate:{
            isDate:true,
        }
    },
    total_amount: {
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
            notEmpty: true,
            notNull: true,
            isValidFormat(value) {
            if (!Array.isArray(value) || value.length === 0) {
                throw new Error("Payment must be an array of currency amounts.");
            }
            for (const entry of value) {
                if (
                typeof entry.currency !== "string" ||
                typeof entry.amount !== "number" ||
                entry.amount < 0
                ) {
                throw new Error("Each payment must have a valid currency and amount.");
                        }
            }
            }
        }
    },
  
    total_amount_paid: {
        type: DataTypes.JSON,
        allowNull: false,
        
        validate: {
            notEmpty: true,
            notNull: true,
            isValidFormat(value) {
            if (!Array.isArray(value) || value.length === 0) {
                throw new Error("Payment must be an array of currency amounts.");
            }
            for (const entry of value) {
                if (
                typeof entry.currency !== "string" ||
                typeof entry.amount !== "number"
                ) {
                throw new Error("Each payment must have a valid currency and amount.");
                        }
            }
            }
        }
    },
    soft_deleted:{
        type:DataTypes.BOOLEAN,
        defaultValue:false,
        allowNull:false,

    },
    note:{
        type:DataTypes.TEXT,
        allowNull:true,  
    },
  


},
{timestamps:true,freezeTableName:true,tableName:"orders"}
)
module.exports=Order;