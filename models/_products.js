const sequlize = require('sequelize');
const {DB} =require('../config/config.js');
const {DataTypes}=sequlize;

const Product=DB.define('Product',{
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
    category_id:{
        type:DataTypes.UUID,
        allowNull:false,
        validate:{

            notEmpty:true,

        },
        references:{
            model:"categories",
            key:"uuid"
        },
        onDelete: 'CASCADE',
            onUpdate:"CASCADE",

    },
    user_id:{
        type:DataTypes.UUID,
        allowNull:false,
        validate:{
            notEmpty:true,
       },
       references:{
        model:"users",
        key:"uuid"
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
            model:"product_status",
            key:"id"
        }
        ,onDelete: 'CASCADE',
            onUpdate:"CASCADE",
    },
    condition_id:{
        type:DataTypes.INTEGER,
        allowNull:false,

        validate:{
            notEmpty:true,
            notNull:true,

        },

        references:{
            model:"product_conditions",
            key:"id"
        },
        onDelete: 'CASCADE',
            onUpdate:"CASCADE",

    },
    currency_id:{
        type:DataTypes.CHAR(3),
        allowNull:false,

        validate:{
            notEmpty:true,
            notNull:true,
            len:[3,3]
        },

        references:{
            model:"currencies",
            key:"currency_iso"
        },
        onDelete: 'CASCADE',
        onUpdate:"CASCADE",
    },
    title:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            notEmpty:true,
        }
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
    stock_quantity_fy:{
        type:DataTypes.INTEGER,
        defaultValue:0,
        allowNull:false,
        validate:{
            notEmpty:true,
            notNull:true,
            

        }
    },
    isactive_name:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:true,
        validate:{
            notEmpty:true,
            notNull:true,
                isBoolean(value) {
                    if (typeof value !== "boolean") {
                        throw new Error("isAvailable must be a boolean");
                }
            }
        }
    },
     isactive_price:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:true,
        validate:{
            notEmpty:true,
            notNull:true,
                isBoolean(value) {
                    if (typeof value !== "boolean") {
                        throw new Error("isAvailable must be a boolean");
                }
            }
        }
    },
     isactive_phonenumber:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:false,
        validate:{
            notEmpty:true,
            notNull:true,
                isBoolean(value) {
                    if (typeof value !== "boolean") {
                        throw new Error("isAvailable must be a boolean");
                }
            }
        }
    },
    isAvailable: {
  type: DataTypes.BOOLEAN,
  allowNull: false,
  defaultValue: true,
  validate: {
    isBoolean(value) {
      if (typeof value !== "boolean") {
        throw new Error("isAvailable must be a boolean");
      }
    }
  }
}
,
     featured:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:false,
        validate:{
            notEmpty:true,
            notNull:true,
                isBoolean(value) {
                    if (typeof value !== "boolean") {
                        throw new Error("isAvailable must be a boolean");
                }
            }
        }
    },
    upcoming:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:false,
        validate:{
            notEmpty:true,
            notNull:true,
                isBoolean(value) {
                    if (typeof value !== "boolean") {
                        throw new Error("isAvailable must be a boolean");
                }
            }
        }
    },
     negotiable:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:false,
        validate:{
            notEmpty:true,
            notNull:true,
                isBoolean(value) {
                    if (typeof value !== "boolean") {
                        throw new Error("isAvailable must be a boolean");
                }
            }
        }
    },
     warranty:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:false,
        validate:{
            notEmpty:true,
            notNull:true,
                isBoolean(value) {
                    if (typeof value !== "boolean") {
                        throw new Error("isAvailable must be a boolean");
                }
            }
        }
    },
     warranty_period:{
        type:DataTypes.INTEGER,
        allowNull:false,
        defaultValue:0,
        validate:{
            notEmpty:true,
            notNull:true,
        
        }
    },
     latest:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:false,
        validate:{
            notEmpty:true,
            notNull:true,
            
        }
    },
      discount:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:false,
        validate:{
            notEmpty:true,
            notNull:true,
                isBoolean(value) {
                    if (typeof value !== "boolean") {
                        throw new Error("discount must be a boolean");
                }
            }
        }
    },
    price:{
        type:DataTypes.DECIMAL(10,2),
        allowNull:true,
        
    },
    original_price:{
                type:DataTypes.DECIMAL(10,2),
        allowNull:false,
        validate:{
            notEmpty:true,
            notNull:true,

        }
    },
    metadata:{
        type:DataTypes.JSON,
        allowNull:true,
        
    },
    softdelete:{
        type: DataTypes.BOOLEAN,
        defaultValue:false,
        allowNull:false
    
    }



},
{timestamps:true,freezeTableName:true,tableName:"products"}
)
module.exports=Product;


