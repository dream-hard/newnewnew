const sequlize= require('sequelize');
const {DB} =require('../config/config.js');
const Supplier = require('./_suppliers.js');
const Product = require('./_products.js');
const Supplier_shipment = require('./_supplier_shipment.js');
const {DataTypes}=sequlize;

const Supplier_shipment_detail= DB.define('Supplier_shipment_detail',
  {
    id:{
       type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    },
    supplier_shipment_id:{

        type:DataTypes.INTEGER,
        allowNull:false,
        
        validate:{
            notEmpty:true,
            notNull:true,

        },
        
    references: {
      model: "supplier_shipments",  
      key: 'id',
    },
    },
    product_id:{
        type:DataTypes.UUID,
        allowNull:true,
        validate:{
            notEmpty:true,  

        },
        references:{
            model:"products",
            key:"uuid"
        }
    },
    quantity:{
        type:DataTypes.INTEGER,
        allowNull:false,
        validate:{
            min:0,
            
        }
    },
    unit_cost:{
        type:DataTypes.DECIMAL(10,2),
        allowNull:true,
    }
    ,
    total:{
        type:DataTypes.DECIMAL(10,2),
        allowNull:true,
    }
    ,
    quantity_paid:{
        type:DataTypes.DECIMAL(10,2),
        allowNull:false,
        defaultValue:0
    }
,
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
        allowNull:false,
        defaultValue:"USD",
        validate:{
            min:0,
            max:3,
        }   
    }
  }
    ,{freezeTableName:true,timestamps:true,tableName:"supplier_shipment_details"})

    module.exports=Supplier_shipment_detail;