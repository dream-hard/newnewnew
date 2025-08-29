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
        }
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
       }
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
        }
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
        }
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




// i have this table and i want to apply this on it : i want order cap by this ordermap in the backend: // orderMap for Product model
// const orderMapM = {
//   // UUID
//   "uuid-asc": [["uuid", "ASC"]],
//   "uuid-desc": [["uuid", "DESC"]],

//   // Relations
//   "category-asc": [["category_id", "ASC"]],
//   "category-desc": [["category_id", "DESC"]],
//   "user-asc": [["user_id", "ASC"]],
//   "user-desc": [["user_id", "DESC"]],
//   "status-asc": [["status_id", "ASC"]],
//   "status-desc": [["status_id", "DESC"]],
//   "condition-asc": [["condition_id", "ASC"]],
//   "condition-desc": [["condition_id", "DESC"]],
//   "currency-asc": [["currency_id", "ASC"]],
//   "currency-desc": [["currency_id", "DESC"]],

//   // Basic fields
//   "title-asc": [["title", "ASC"]],
//   "title-desc": [["title", "DESC"]],
//   "slug-asc": [["slug", "ASC"]],
//   "slug-desc": [["slug", "DESC"]],

//   // Numbers
//   "stock-asc": [["stock_quantity_fy", "ASC"]],
//   "stock-desc": [["stock_quantity_fy", "DESC"]],
//   "price-asc": [["price", "ASC"]],
//   "price-desc": [["price", "DESC"]],
//   "original_price-asc": [["original_price", "ASC"]],
//   "original_price-desc": [["original_price", "DESC"]],
//   "warranty_period-asc": [["warranty_period", "ASC"]],
//   "warranty_period-desc": [["warranty_period", "DESC"]],

//   // Flags / booleans
//   "active_name-asc": [["isactive_name", "ASC"]],
//   "active_name-desc": [["isactive_name", "DESC"]],
//   "active_price-asc": [["isactive_price", "ASC"]],
//   "active_price-desc": [["isactive_price", "DESC"]],
//   "active_phone-asc": [["isactive_phonenumber", "ASC"]],
//   "active_phone-desc": [["isactive_phonenumber", "DESC"]],
//   "available-asc": [["isAvailable", "ASC"]],
//   "available-desc": [["isAvailable", "DESC"]],
//   "featured-asc": [["featured", "ASC"]],
//   "featured-desc": [["featured", "DESC"]],
//   "upcoming-asc": [["upcoming", "ASC"]],
//   "upcoming-desc": [["upcoming", "DESC"]],
//   "negotiable-asc": [["negotiable", "ASC"]],
//   "negotiable-desc": [["negotiable", "DESC"]],
//   "warranty-asc": [["warranty", "ASC"]],
//   "warranty-desc": [["warranty", "DESC"]],
//   "latest-asc": [["latest", "ASC"]],
//   "latest-desc": [["latest", "DESC"]],
//   "discount-asc": [["discount", "ASC"]],
//   "discount-desc": [["discount", "DESC"]],
//   "softdelete-asc": [["softdelete", "ASC"]],
//   "softdelete-desc": [["softdelete", "DESC"]],

//   // Timestamps
//   "created-asc": [["createdAt", "ASC"]],
//   "created-desc": [["createdAt", "DESC"]],
//   "updated-asc": [["updatedAt", "ASC"]],
//   "updated-desc": [["updatedAt", "DESC"]],
// };  , i want also search section like for this contorller exports.filterproducts=async(req,res)=>{
//   try {
//     const {
//       page=1,
//       limit=10,
//       orderby,
//       id,
//       category_ids,
//       user_id,
//       status_id,
//       condition_id,
//       currency,
//       title,
//       product_slug,
//       slugs,
//       quantity_foryou,
//       quantity_dir='eq',
//       isactive_name,
//       isactive_phonenumber,
//       isactive_price,
//       isAvailable,
//       featured,
//       upcoming,
//       negotiable,
//       warranty,
//       warranty_period,
//       warranty_period_dir='eq',
//       latest,
//       discount,
//       price,
//       price_dir='eq',
//       original_price,
//       original_price_dir="eq",
//       includedeletedcategory,
//       onlyDeletedCategory ,
//       softdelete}=req.body;
//     page=parseInt(page);
//     limit=parseInt(limit);
//     const offset=(page-1)*limit;
//     let order=orderMapM[orderby]||orderMapM["created-desc"];
// let where = {};
// if (id) where.uuid = id;
// if (user_id) where.user_id = user_id;
// if (status_id) where.status_id = status_id;
// if (condition_id) where.condition_id = condition_id;
// if (currency) where.currency_id = currency;
// if (title) where.title = { [Op.like]: `%${title}%` };
// if (product_slug) where.slug = { [Op.like]: `%${product_slug}%` };
// if (quantity_foryou !== undefined && quantity_dir) {
//   switch (quantity_dir) {
//     case "eq": // equal
//       where.stock_quantity_fy = { [Op.eq]: quantity_foryou };
//       break;
//     case "gte": // greater or equal
//       where.stock_quantity_fy = { [Op.gte]: quantity_foryou };
//       break;
//     case "lte": // less or equal
//       where.stock_quantity_fy = { [Op.lte]: quantity_foryou };
//       break;
//     case "gt": // strictly greater
//       where.stock_quantity_fy = { [Op.gt]: quantity_foryou };
//       break;
//     case "lt": // strictly lower
//       where.stock_quantity_fy = { [Op.lt]: quantity_foryou };
//       break;
//     default:
//       where.stock_quantity_fy = { [Op.eq]: quantity_foryou };
//       break;
//   }
// }
// if (warranty_period !== undefined && warranty_period_dir) {
//   switch (warranty_period_dir) {
//     case "eq":
//       where.warranty_period = { [Op.eq]: warranty_period };
//       break;
//     case "gte":
//       where.warranty_period = { [Op.gte]: warranty_period };
//       break;
//     case "lte":
//       where.warranty_period = { [Op.lte]: warranty_period };
//       break;
//     case "gt":
//       where.warranty_period = { [Op.gt]: warranty_period };
//       break;
//     case "lt":
//       where.warranty_period = { [Op.lt]: warranty_period };
//       break;
//     default:
//       where.warranty_period = { [Op.eq]: warranty_period };
//       break;
//   }
// }
// if (price !== undefined && price_dir) {
//   switch (price_dir) {
//     case "eq": where.price = { [Op.eq]: price }; break;
//     case "gte": where.price = { [Op.gte]: price }; break;
//     case "lte": where.price = { [Op.lte]: price }; break;
//     case "gt": where.price = { [Op.gt]: price }; break;
//     case "lt": where.price = { [Op.lt]: price }; break;
//     default :where.price = { [Op.eq]: price }; break;
//   }
// }
// if (original_price !== undefined && original_price_dir) {
//   switch (original_price_dir) {
//     case "eq": where.original_price = { [Op.eq]:original_price }; break;
//     case "gte": where.original_price = { [Op.gte]: original_price }; break;
//     case "lte": where.original_price = { [Op.lte]: original_price }; break;
//     case "gt": where.original_price = { [Op.gt]: original_price }; break;
//     case "lt": where.original_price = { [Op.lt]: original_price }; break;
//     default: where.original_price = { [Op.eq]:original_price }; break;
//   }
// }
// if (isactive_name !== undefined) where.isactive_name = isactive_name;
// if (isactive_phonenumber !== undefined) where.isactive_phonenumber = isactive_phonenumber;
// if (isactive_price !== undefined) where.isactive_price = isactive_price;
// if (isAvailable !== undefined) where.isAvailable = isAvailable;
// if (featured !== undefined) where.featured = featured;
// if (upcoming !== undefined) where.upcoming = upcoming;
// if (negotiable !== undefined) where.negotiable = negotiable;
// if (warranty !== undefined) where.warranty = warranty;
// if (latest !== undefined) where.latest = latest;
// if (discount !== undefined) where.discount = discount;

// if (price) where.price = { [Op.lte]: price }; // products less than or equal to given price
// if (original_price) where.original_price = { [Op.lte]: original_price };

// if (softdelete !== undefined) where.softdelete = softdelete;
//     let rootCats=[];
//     let allIds=[];
    
//     if (slugs && slugs.length > 0) {
//       rootCats = await Category.findAll({
//         where: { slug: { [Op.in]: slugs } }
//       });
//     } else if (req.body.category_ids && req.body.category_ids.length > 0) {
//       rootCats = await Category.findAll({
//         where: { uuid: { [Op.in]: category_ids } }
//       });
//     }

//     for (const cat of rootCats) {
//       const ids = await getAllCategoryIds(cat.uuid); // your helper
//       allIds.push(...ids);
//     }
//     allIds = [...new Set(allIds)];

//     let categoryWhere = {};

//     // softdelete filter logic
//     if (includedeletedcategory === true) {
//       // no filter, get both deleted and non-deleted
//     } else if (includedeletedcategory === false) {
//       categoryWhere.softdelete = 0; // only not deleted
//     } else if (onlyDeletedCategory === true) {
//       categoryWhere.softdelete = 1; // only deleted
//     }

//     // filter by allIds if present
//     if (allIds && allIds.length > 0) {
//       categoryWhere.uuid = { [Op.in]: allIds };
//     }

//     const includeOptions = [
//     {
//       model: Category,
//       required: true,
//       where: categoryWhere,
//       attributes: [ 'name', 'slug',"uuid"]
//     },
//     {
//       model: Currency,
//       required: true,
//       attributes: ['currency_iso', 'symbol'] // فقط الـ ID والرمز
//     },
//       {model:Product_image,
//         attributes: ['filename'],
//         where: { image_type: 'main' },
//         required: false
//     },
//   ];

//   // إضافة الـ attributes filter إذا موجود
//   if (attribute_option_ids.length > 0) {
//     includeOptions.push({
//       model: Product_attribute,
//       required: true,
//       where: {
//         attribute_option_id: { [Op.in]: attribute_option_ids }
//       },
//       attributes: []
//     });
//   }

//     const queryOptions = {
//     where,
//     include: includeOptions,
//     group: ['Product.uuid'],
//     order,
//     limit,
//     offset,
//     subQuery: false
//     ,raw:true,
//     nest:true
//   };
//   if (attribute_option_ids.length > 0) {
//     queryOptions.having = Sequelize.literal(
//       `COUNT(DISTINCT "Product_attributes"."attribute_option_id") = ${attribute_option_ids.length}`
//     );
//   }
//   const { count, rows } = await Product.findAndCountAll(queryOptions);
//   if(!count || !rows)return res.status(404).json({error:"didn't found any product",msg:""});

//   return res.status(200).json({
//       products: rows,
//       total: count,
//       currentPage: page,
//       totalPages: Math.ceil(count / limit)
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// } i want like each attirbute have like somthing for it for search or filter like i named it , i want to be the tabel tr and th adn td are correct for this model:const sequlize = require('sequelize');
// const {DB} =require('../config/config.js');
// const {DataTypes}=sequlize;

// const Product=DB.define('Product',{
//      uuid:{
//         type:DataTypes.UUID,
//         defaultValue: DataTypes.UUIDV4,
//         unique:true,
//         allowNull:false,
//         primaryKey:true,
        
//         validate:{
//             notEmpty:true,
//             notNull:true,

//         }
//     },
//     category_id:{
//         type:DataTypes.UUID,
//         allowNull:false,
//         validate:{
//             isUUID:true,
//             notEmpty:true,

//         },
//         references:{
//             model:"categories",
//             key:"uuid"
//         }
//     },
//     user_id:{
//         type:DataTypes.UUID,
//         allowNull:false,
//         validate:{
//             notEmpty:true,
//        },
//        references:{
//         model:"users",
//         key:"uuid"
//        }
//     },
//     status_id:{
//         type:DataTypes.INTEGER,
//         allowNull:false,

//         validate:{
//             notEmpty:true,
//             notNull:true,

//         },

//         references:{
//             model:"product_status",
//             key:"id"
//         }
//     },
//     condition_id:{
//         type:DataTypes.INTEGER,
//         allowNull:false,

//         validate:{
//             notEmpty:true,
//             notNull:true,

//         },

//         references:{
//             model:"product_conditions",
//             key:"id"
//         }
//     },
//     currency_id:{
//         type:DataTypes.CHAR(3),
//         allowNull:false,

//         validate:{
//             notEmpty:true,
//             notNull:true,
//             len:[3,3]
//         },

//         references:{
//             model:"currencies",
//             key:"currency_iso"
//         }
//     },
//     title:{
//         type:DataTypes.STRING,
//         allowNull:false,
//         validate:{
//             notEmpty:true,
//         }
//     },
//     slug:{
//         type:DataTypes.STRING,
//         unique:true,
//         allowNull:false,
//         validate:{
//             notEmpty:true,
//             notNull:true,
//         }
//     },
//     description:{
//         type:DataTypes.TEXT,
//         allowNull:true,
//     },
//     stock_quantity_fy:{
//         type:DataTypes.INTEGER,
//         defaultValue:0,
//         allowNull:false,
//         validate:{
//             notEmpty:true,
//             notNull:true,
            

//         }
//     },
//     isactive_name:{
//         type:DataTypes.BOOLEAN,
//         allowNull:false,
//         defaultValue:true,
//         validate:{
//             notEmpty:true,
//             notNull:true,
//                 isBoolean(value) {
//                     if (typeof value !== "boolean") {
//                         throw new Error("isAvailable must be a boolean");
//                 }
//             }
//         }
//     },
//      isactive_price:{
//         type:DataTypes.BOOLEAN,
//         allowNull:false,
//         defaultValue:true,
//         validate:{
//             notEmpty:true,
//             notNull:true,
//                 isBoolean(value) {
//                     if (typeof value !== "boolean") {
//                         throw new Error("isAvailable must be a boolean");
//                 }
//             }
//         }
//     },
//      isactive_phonenumber:{
//         type:DataTypes.BOOLEAN,
//         allowNull:false,
//         defaultValue:false,
//         validate:{
//             notEmpty:true,
//             notNull:true,
//                 isBoolean(value) {
//                     if (typeof value !== "boolean") {
//                         throw new Error("isAvailable must be a boolean");
//                 }
//             }
//         }
//     },
//     isAvailable: {
//   type: DataTypes.BOOLEAN,
//   allowNull: false,
//   defaultValue: true,
//   validate: {
//     isBoolean(value) {
//       if (typeof value !== "boolean") {
//         throw new Error("isAvailable must be a boolean");
//       }
//     }
//   }
// }
// ,
//      featured:{
//         type:DataTypes.BOOLEAN,
//         allowNull:false,
//         defaultValue:false,
//         validate:{
//             notEmpty:true,
//             notNull:true,
//                 isBoolean(value) {
//                     if (typeof value !== "boolean") {
//                         throw new Error("isAvailable must be a boolean");
//                 }
//             }
//         }
//     },
//     upcoming:{
//         type:DataTypes.BOOLEAN,
//         allowNull:false,
//         defaultValue:false,
//         validate:{
//             notEmpty:true,
//             notNull:true,
//                 isBoolean(value) {
//                     if (typeof value !== "boolean") {
//                         throw new Error("isAvailable must be a boolean");
//                 }
//             }
//         }
//     },
//      negotiable:{
//         type:DataTypes.BOOLEAN,
//         allowNull:false,
//         defaultValue:false,
//         validate:{
//             notEmpty:true,
//             notNull:true,
//                 isBoolean(value) {
//                     if (typeof value !== "boolean") {
//                         throw new Error("isAvailable must be a boolean");
//                 }
//             }
//         }
//     },
//      warranty:{
//         type:DataTypes.BOOLEAN,
//         allowNull:false,
//         defaultValue:false,
//         validate:{
//             notEmpty:true,
//             notNull:true,
//                 isBoolean(value) {
//                     if (typeof value !== "boolean") {
//                         throw new Error("isAvailable must be a boolean");
//                 }
//             }
//         }
//     },
//      warranty_period:{
//         type:DataTypes.INTEGER,
//         allowNull:false,
//         defaultValue:0,
//         validate:{
//             notEmpty:true,
//             notNull:true,
        
//         }
//     },
//      latest:{
//         type:DataTypes.BOOLEAN,
//         allowNull:false,
//         defaultValue:false,
//         validate:{
//             notEmpty:true,
//             notNull:true,
            
//         }
//     },
//       discount:{
//         type:DataTypes.BOOLEAN,
//         allowNull:false,
//         defaultValue:false,
//         validate:{
//             notEmpty:true,
//             notNull:true,
//                 isBoolean(value) {
//                     if (typeof value !== "boolean") {
//                         throw new Error("discount must be a boolean");
//                 }
//             }
//         }
//     },
//     price:{
//         type:DataTypes.DECIMAL(10,2),
//         allowNull:true,
        
//     },
//     original_price:{
//                 type:DataTypes.DECIMAL(10,2),
//         allowNull:false,
//         validate:{
//             notEmpty:true,
//             notNull:true,

//         }
//     },
//     metadata:{
//         type:DataTypes.JSON,
//         allowNull:true,
        
//     },
//     softdelete:{
//         type: DataTypes.BOOLEAN,
//         defaultValue:false,
//         allowNull:false
    
//     }



// },
// {timestamps:true,freezeTableName:true,tableName:"products"}
// )
// module.exports=Product; and do what you show is correct