const sequlize= require('sequelize');
const {DB} =require('../config/config.js');
const Supplier = require('./_suppliers.js');
const {DataTypes}=sequlize;

const Supplier_shipment= DB.define('Supplier_shipment',
  {
    id:{
       type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    },
    supplier_id:{

        type:DataTypes.STRING(38),
        allowNull:false,
        
        validate:{
            notEmpty:true,
            notNull:true,

        },
        
    references: {
      model: "suppliers",  
      key: 'uuid',
    },
    },
    date_received:{
        type:DataTypes.DATEONLY,
        allowNull:true,

    },
    total_cost:{
        type:DataTypes.DECIMAL(10,3),
        allowNull:false,
        validate:{
            notEmpty:true,
            notNull:true,
        },
    }
    ,paid:{
         type:DataTypes.DECIMAL(10,3),
        allowNull:false,
        defaultValue:0,
        validate:{
            notEmpty:true,
            notNull:true,
        }
    },
    currency:{
        type:DataTypes.CHAR(3),
        defaultValue:"USD",
        allowNull:false,
        validate:{
            min:0,
            max:3,
        }
    }
  }
    ,{freezeTableName:true,timestamps:true,tableName:"Supplier_shipments"})

    module.exports=Supplier_shipment;