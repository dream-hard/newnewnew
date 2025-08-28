const path = require("path");
const fs = require("fs");
const Category = require('../models/_categories.js');

const Product = require('../models/_products.js');
const { getAllCategoryIds } = require('./categoryController.js');
const{Product,Product_attribute, Currency, Product_image, Attribute_option, Attribute_type, Product_condition, Product_statu, User, }=require('../models');
const { Op,Sequelize } = require('sequelize');
const { raw } = require('body-parser');
const { DB:sequelize } = require("../config/config.js");

// orderMap for Product model
const orderMapM = {
  // UUID
  "uuid-asc": [["uuid", "ASC"]],
  "uuid-desc": [["uuid", "DESC"]],

  // Relations
  "category-asc": [["category_id", "ASC"]],
  "category-desc": [["category_id", "DESC"]],
  "user-asc": [["user_id", "ASC"]],
  "user-desc": [["user_id", "DESC"]],
  "status-asc": [["status_id", "ASC"]],
  "status-desc": [["status_id", "DESC"]],
  "condition-asc": [["condition_id", "ASC"]],
  "condition-desc": [["condition_id", "DESC"]],
  "currency-asc": [["currency_id", "ASC"]],
  "currency-desc": [["currency_id", "DESC"]],

  // Basic fields
  "title-asc": [["title", "ASC"]],
  "title-desc": [["title", "DESC"]],
  "slug-asc": [["slug", "ASC"]],
  "slug-desc": [["slug", "DESC"]],

  // Numbers
  "stock-asc": [["stock_quantity_fy", "ASC"]],
  "stock-desc": [["stock_quantity_fy", "DESC"]],
  "price-asc": [["price", "ASC"]],
  "price-desc": [["price", "DESC"]],
  "original_price-asc": [["original_price", "ASC"]],
  "original_price-desc": [["original_price", "DESC"]],
  "warranty_period-asc": [["warranty_period", "ASC"]],
  "warranty_period-desc": [["warranty_period", "DESC"]],

  // Flags / booleans
  "active_name-asc": [["isactive_name", "ASC"]],
  "active_name-desc": [["isactive_name", "DESC"]],
  "active_price-asc": [["isactive_price", "ASC"]],
  "active_price-desc": [["isactive_price", "DESC"]],
  "active_phone-asc": [["isactive_phonenumber", "ASC"]],
  "active_phone-desc": [["isactive_phonenumber", "DESC"]],
  "available-asc": [["isAvailable", "ASC"]],
  "available-desc": [["isAvailable", "DESC"]],
  "featured-asc": [["featured", "ASC"]],
  "featured-desc": [["featured", "DESC"]],
  "upcoming-asc": [["upcoming", "ASC"]],
  "upcoming-desc": [["upcoming", "DESC"]],
  "negotiable-asc": [["negotiable", "ASC"]],
  "negotiable-desc": [["negotiable", "DESC"]],
  "warranty-asc": [["warranty", "ASC"]],
  "warranty-desc": [["warranty", "DESC"]],
  "latest-asc": [["latest", "ASC"]],
  "latest-desc": [["latest", "DESC"]],
  "discount-asc": [["discount", "ASC"]],
  "discount-desc": [["discount", "DESC"]],
  "softdelete-asc": [["softdelete", "ASC"]],
  "softdelete-desc": [["softdelete", "DESC"]],

  // Timestamps
  "created-asc": [["createdAt", "ASC"]],
  "created-desc": [["createdAt", "DESC"]],
  "updated-asc": [["updatedAt", "ASC"]],
  "updated-desc": [["updatedAt", "DESC"]],
};

function generateSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')   // remove special characters
    .replace(/\s+/g, '-')           // replace spaces with hyphens
    .replace(/-+/g, '-')            // remove multiple hyphens
    .replace(/^-+|-+$/g, '');       // trim hyphens from start and end
}

exports.create = async (req, res) => {
  try {
    const {cat,user,status,condition,currency,title,quantity,active_name,active_number,active_prcie,available,featured,upcoming,negotiable,warranty,warranty_peroid,latest,discount,price,original_price,metadata}=req.body;
    const slug=generateSlug(title);
    const product = await Product.create({
      category_id:cat,
      user_id:user,
      status_id:status,
      condition_id:condition,
      currency_id:currency,
      title,
      slug,
      stock_quantity_fy:quantity,
      isactive_name:active_name,
      isactive_phonenumber:active_number,
      isactive_price:active_prcie,
      isAvailable:available,
      featured,
      upcoming,
      negotiable,
      warranty,
      warranty_peroid,
      latest,
      discount,
      price,
      original_price,
      metadata
    },{raw:true,nest:true});
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const products = await Product.findAll({raw:true,nest:true});
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getByUuid = async (req, res) => {
  try {
    const product = await Product.findByPk(req.body.id ,{raw:true});
    if (!product) return res.status(404).json({ error: "Not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const {id}=req.body;
    let {cat,user,status,condition,currency,title,quantity,active_name,active_number,active_price,available,featured,upcoming,negotiable,warranty,warranty_peroid,latest,discount,price,original_price,metadata}=req.body;
    const old=await Product.findByPk(id);
    if(!cat)cat=old.category_id;
    if(!user)user=old.user_id;
    if(!status)status=old.status_id;
    if(!condition)condition=old.condition_id;
    if(!currency)currency=old.currency_id;
    let slug;
    if(!title){title=old.title;slug=old.slug}else{slug=generateSlug(title)}
    if(!quantity)quantity=old.stock_quantity_fy;
    if(active_name===null||active_name===undefined)active_name=old.isactive_name;
    if(active_number===null||active_number===undefined)active_number=old.isactive_phonenumber;
    if(active_price===null||active_price===undefined)active_price=old.isactive_price;
    if(available===null||available===undefined)available=old.isAvailable;
    if(featured===null||featured===undefined)featured=old.featured;
    if(upcoming===null||upcoming===undefined)upcoming=old.upcoming;
    if(negotiable===null||negotiable===undefined)negotiable=old.negotiable;
    if(warranty===null|| warranty===undefined)warranty-old.warranty;
    if(warranty_peroid===null|| warranty_peroid===undefined)warranty_peroid=old.warranty_peroid;
    if(latest===null||latest===undefined)latest=old.latest;
    if(discount===null||discount===undefined)discount=old.discount;
    if(price===null||price===undefined)price=old.price;
    if(original_price===null||original_price===undefined)original_price=old.original_price;
    if(!metadata)metadata=old.metadata;
    const [updated] = await Product.update({
      category_id:cat,
      user_id:user,
      status_id:status,
      condition_id:condition,
      currency_id:currency,
      title,
      slug,
      stock_quantity_fy:quantity,
      isactive_name:active_name,
      isactive_phonenumber:active_number,
      isactive_price:active_prcie,
      isAvailable:available,
      featured,
      upcoming,
      negotiable,
      warranty,
      warranty_peroid,
      latest,
      discount,
      price,
      original_price,
      metadata
    }, {
      where: { uuid: id },
    });
    if (!updated) return res.status(404).json({ error: "Not found" });
    const updatedProduct = await Product.findByPk(req.body.id);
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
////////////3
exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.body;

        // 1️⃣ Find the product
        const product = await Product.findByPk(id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        // 2️⃣ Find all images associated with this product
        const images = await Product_image.findAll({ where: { product_id: product.uuid } });

        // 3️⃣ Delete images from disk and DB
        for (let image of images) {
            const filePath = path.join(__dirname, '..','..', 'uploads', image.disk_filename);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath); // delete file if exists
            await image.destroy(); // remove from DB
        }

        // 4️⃣ Delete the product
        await product.destroy();

        res.status(200).json({ message: "Product and all associated images deleted successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

exports.softdelete=async (req,res)=>{
  try {
    
    const {id}=req.body;

    const [softdelete]=await Product.update({softdelete:0},{where:{uuid:id}});
    if (!softdelete) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });

  } catch (error) {
     res.status(500).json({ error: error.message });

  }
}











//////////////////////////////////////////////


// usage:

// routes/categories.js
exports.getallproductsbyids= async (req, res) => {
  try {
    const { slug } = req.body;
    const page      = Math.max(parseInt(req.body.page, 10)  || 1, 1);
    const limit     = Math.max(parseInt(req.body.limit, 10) || 10, 1);
    const offset    = (page - 1) * limit;
    const orderby   = req.body.orderby ;


    // Fallback to createdAt DESC if unknown
    const orderClause = orderMapM[orderby] || [['createdAt', 'DESC']];

    // 1) fetch root cat
    const rootCat = await Category.findOne({ where: { slug } });
    if (!rootCat) return res.status(404).json({ error: 'Category not found' });

    // 2) gather IDs (same helper as before)
    const allIds = await getAllCategoryIds(rootCat.id);
    if (allIds.length === 0) {
    return res.status(404).json({ message: "No subcategories found." });
    } 
    // 3) query products with pagination + ordering
    const { count, rows } = await Product.findAndCountAll({
      where: { categoryId: allIds },
      limit,
      offset,
      order: orderClause,
    });
    // 4) respond
    res.status(200).json({
      items:       rows,
      totalPages:  Math.ceil(count / limit),
      currentPage: page,
      totalItems:  count,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};


// const {
//   slug,
//   page = 1,
//   limit = 10,
//   orderby = 'date',
//   attribute_option_ids = []
// } = req.body;

// const offset = (page - 1) * limit;

// const orderMap = {
//   popularity: [['salesCount', 'DESC']],
//   'popularity-asc': [['salesCount', 'ASC']],
//   'popularity-desc': [['salesCount', 'DESC']],

//   rating: [['averageRating', 'DESC']],
//   'rating-asc': [['averageRating', 'ASC']],
//   'rating-desc': [['averageRating', 'DESC']],

//   date: [['createdAt', 'DESC']],
//   'date-asc': [['createdAt', 'ASC']],
//   'date-desc': [['createdAt', 'DESC']],

//   price: [['price', 'ASC']],
//   'price-asc': [['price', 'ASC']],
//   'price-desc': [['price', 'DESC']],
// };

// const orderClause = orderMap[orderby] || [['createdAt', 'DESC']];

// // 2. Get category and subcategory IDs
// const rootCat = await Category.findOne({ where: { slug } });
// if (!rootCat) return res.status(404).json({ error: 'Category not found' });

// const allIds = await getAllCategoryIds(rootCat.id); // your helper method

// // 3. Filter products by matching ALL selected attributes
// let productWhere = {
//   category_id: { [Op.in]: allIds }
// };

// let includeOptions = [];

// if (attribute_option_ids.length > 0) {
//   includeOptions.push({
//     model: Product_attribute,
//     required: true,
//     where: {
//       attribute_option_id: { [Op.in]: attribute_option_ids }
//     },
//     attributes: [] // we don't need extra fields here
//   });
// }

// // 4. Query with grouping
// const { count, rows } = await Product.findAndCountAll({
//   where: productWhere,
//   include: includeOptions,
//   group: ['Product.uuid'], // ensure no duplicates
//   having: Sequelize.literal(`COUNT(DISTINCT "Product_attributes"."attribute_option_id") = ${attribute_option_ids.length}`),
//   order: orderClause,
//   limit,
//   offset,
//   subQuery: false,
// });

exports.getProductsByCategory = async (req, res) => {
  try {
    // 1. Extract from body
    const {
      slug,
      page = 1,
      limit = 10,
      orderby = 'date',
      attribute_option_ids = []
    } = req.body;

    const offset = (page - 1) * limit;

    

    const orderClause = orderMapM[orderby] || [['createdAt', 'DESC']];

    // 2. Get category and subcategory IDs
    const rootCat = await Category.findOne({ where: { slug } });
    if (!rootCat) return res.status(404).json({ error: 'Category not found' });

    const allIds = await getAllCategoryIds(rootCat.uuid); // your helper method

    let productWhere = { softdelete: 0 };

    if (req.body.hasOwnProperty('discount')) {
  productWhere.discount = !!req.body.discount; // يحول القيمة لأي boolean
  }
  

  const includeOptions = [
  {
    model: Category,
    required: true,
    where: {
      uuid: { [Op.in]: allIds },
      softdelete: 0
    },
    attributes: [ 'name', 'slug']
  },
  {
    model: Currency,
    required: true,
    attributes: ['currency_iso', 'symbol'] // فقط الـ ID والرمز
  },
    {model:Product_image,
      attributes: ['filename'],
      where: { image_type: 'main' },
      required: false
  },
];

// إضافة الـ attributes filter إذا موجود
if (attribute_option_ids.length > 0) {
  includeOptions.push({
    model: Product_attribute,
    required: true,
    where: {
      attribute_option_id: { [Op.in]: attribute_option_ids }
    },
    attributes: []
  });
}

    const queryOptions = {
  where: productWhere,
  include: includeOptions,
  group: ['Product.uuid'],
  order: orderClause,
  limit,
  offset,
  subQuery: false
  ,raw:true,
  nest:true
};

// Only apply HAVING if filtering by attributes
if (attribute_option_ids.length > 0) {
  queryOptions.having = Sequelize.literal(
    `COUNT(DISTINCT "Product_attributes"."attribute_option_id") = ${attribute_option_ids.length}`
  );
}

///////////////////////////////////////////////////////////////////////////////////
    // 4. Query with grouping
   const { count, rows } = await Product.findAndCountAll(queryOptions);

    // 5. Return response
    return res.status(200).json({
      products: rows,
      total: Array.isArray(count) ? count.length : count,
      currentPage: Number(page),
      totalPages: Math.ceil((Array.isArray(count) ? count.length : count) / limit)
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};


exports.getProductsByCategoryWithdiscount = async (req, res) => {
  try {
    const {
      slug,
      page = 1,
      limit = 10,
      orderby ,
      attribute_option_ids = []
    } = req.body;

    const offset = (page - 1) * limit;

    const orderClause = orderMapM[orderby] || [['createdAt', 'DESC']];

    // 2. Get category and subcategory IDs
    const rootCat = await Category.findOne({ where: { slug } });
    if (!rootCat) return res.status(404).json({ error: 'Category not found' });

    const allIds = await getAllCategoryIds(rootCat.id); // your helper method

  

  const includeOptions = [
  {
    model: Category,
    required: true,
    where: {
      uuid: { [Op.in]: allIds },
      softdelete: 0
    },
    attributes: [ 'name', 'slug']
  },
  {
    model: Currency,
    required: true,
    attributes: ['currency_iso', 'symbol'] // فقط الـ ID والرمز
  },
  {model:Product_image,
      attributes: ['filename'],
      where: { image_type: 'main' },
      required: false
  },
];

// إضافة الـ attributes filter إذا موجود
if (attribute_option_ids.length > 0) {
  includeOptions.push({
    model: Product_attribute,
    required: true,
    where: {
      attribute_option_id: { [Op.in]: attribute_option_ids }
    },
    attributes: []
  });
}

    const queryOptions = {
  where: { softdelete: 0 },
  include: includeOptions,
  group: ['Product.uuid'],
  order: orderClause,
  limit,
  offset,
  subQuery: false
  ,raw:true,
  nest:true
};

// Only apply HAVING if filtering by attributes
if (attribute_option_ids.length > 0) {
  queryOptions.having = Sequelize.literal(
    `COUNT(DISTINCT "Product_attributes"."attribute_option_id") = ${attribute_option_ids.length}`
  );
}

///////////////////////////////////////////////////////////////////////////////////
    // 4. Query with grouping
   const { count, rows } = await Product.findAndCountAll(queryOptions);

    // 5. Return response
    return res.status(200).json({
      products: rows,
      total: Array.isArray(count) ? count.length : count,
      currentPage: Number(page),
      totalPages: Math.ceil((Array.isArray(count) ? count.length : count) / limit)
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};





exports.searchProductsByTitle = async (req, res) => {
  try {
    const { title = '', page = 1, limit = 10,orderby } = req.body;
    page=parsin(page);
    limit=parseInt(limit);
    const offset = (page - 1) * limit;
    let order=orderMapM[orderby]||orderMapM["created-desc"];
    const { count, rows } = await Product.findAndCountAll({
      where: {
        title: { [Op.like]: `%${title}%` },
        softdelete: 0
      },
      attributes: [
        'uuid',
        'title',
        'slug',
        'price',
        'original_price',
        'discount',
        'isAvailable',
        'isactive_price'
      ],
      include: [
        {
          model: Category,
          attributes: [ 'name', 'slug'],
          where: { softdelete: 0 },
          required: false
        },
        {
          model: Currency,
          attributes: ['currency_iso', 'symbol'],
          required: false
        },
        {
          model: Product_image,
          attributes: ['filename'],
          where: { image_type: 'main' },
          required: false
        }
      ],
      limit,
      offset,
      order
      ,raw:true,
      nest:true,
    });

    return res.status(200).json({
      products: rows,
      total: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};



//////2
exports.fullupdate = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.body;
    const old = await Product.findByPk(id, { transaction });
    if (!old) {
      await transaction.rollback();
      return res.status(404).json({ error: "Product not found" });
    }

    // Prepare updated data with fallback to old values
    const {
      cat, user, status, condition, currency, title, quantity,
      active_name, active_number, active_price, available, featured,
      upcoming, negotiable, warranty, warranty_peroid, latest,
      discount, price, original_price, metadata
    } = req.body;

    const slug = title ? generateSlug(title) : old.slug;

    const updateData = {
      category_id: cat || old.category_id,
      user_id: user || old.user_id,
      status_id: status || old.status_id,
      condition_id: condition || old.condition_id,
      currency_id: currency || old.currency_id,
      title: title || old.title,
      slug,
      stock_quantity_fy: quantity || old.stock_quantity_fy,
      isactive_name: active_name ?? old.isactive_name,
      isactive_phonenumber: active_number ?? old.isactive_phonenumber,
      isactive_price: active_price ?? old.isactive_price,
      isAvailable: available ?? old.isAvailable,
      featured: featured ?? old.featured,
      upcoming: upcoming ?? old.upcoming,
      negotiable: negotiable ?? old.negotiable,
      warranty: warranty ?? old.warranty,
      warranty_peroid: warranty_peroid ?? old.warranty_peroid,
      latest: latest ?? old.latest,
      discount: discount ?? old.discount,
      price: price ?? old.price,
      original_price: original_price ?? old.original_price,
      metadata: metadata || old.metadata,
    };

    // Update product
    await Product.update(updateData, { where: { id }, transaction });

    // Handle image replacement
  const types = req.body.types; // array of types sent from frontend

if (req.files && req.files.length > 0) {
  // Delete old images first
  const oldImages = await Product_image.findAll({ where: { product_id: id }, transaction });
  for (const img of oldImages) {
    const imgPath = path.join(__dirname, "..", img.image_url);
    if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
  }
  await Product_image.destroy({ where: { product_id: id }, transaction });
Product_image
  // Save new images with their type
  const imagePromises = req.files.map((file, index) =>
    Product_image.create(
      {
        product_id: id,
        image_url: `/uploads/${file.filename}`,
        image_type: types[index] || "sup", // fallback type
      },
      { transaction }
    )
  );
  await Promise.all(imagePromises);
}


    await transaction.commit();

    const updatedProduct = await Product.findByPk(id, { include: [Product_image] });
    res.json(updatedProduct,{succes:true});

  } catch (error) {
    await transaction.rollback();
    res.status(400).json({ error: error.message,succes:false });
  }
};


exports.updateProductWithImages = async (req, res) => {
    try {
        const { id } = req.body;
        const {
            cat, user, status, condition, currency, title, quantity,
            active_name, active_number, active_prcie, available, featured,
            upcoming, negotiable, warranty, warranty_peroid, latest,
            discount, price, original_price, metadata,
            delete_filenames = [],attributes
        } = req.body;

        // 1️⃣ Find the product
        const product = await Product.findByPk(id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        // 2️⃣ Update product fields if provided
        const slug = title ? generateSlug(title) : product.slug;

        await product.update({
            category_id: cat || product.category_id,
            user_id: user || product.user_id,
            status_id: status || product.status_id,
            condition_id: condition || product.condition_id,
            currency_id: currency || product.currency_id,
            title: title || product.title,
            slug: slug || product.slug,
            stock_quantity_fy: quantity || product.stock_quantity_fy,
            isactive_name: active_name !== undefined ? active_name : product.isactive_name,
            isactive_phonenumber: active_number !== undefined ? active_number : product.isactive_phonenumber,
            isactive_price: active_prcie !== undefined ? active_prcie : product.isactive_price,
            isAvailable: available !== undefined ? available : product.isAvailable,
            featured: featured !== undefined ? featured : product.featured,
            upcoming: upcoming !== undefined ? upcoming : product.upcoming,
            negotiable: negotiable !== undefined ? negotiable : product.negotiable,
            warranty: warranty !== undefined ? warranty : product.warranty,
            warranty_peroid: warranty_peroid || product.warranty_peroid,
            latest: latest !== undefined ? latest : product.latest,
            discount: discount !== undefined ? discount : product.discount,
            price: price || product.price,
            original_price: original_price || product.original_price,
            metadata: metadata || product.metadata
        });

        // 3️⃣ Delete old images by filename
        for (let filename of delete_filenames) {
            const image = await Product_image.findOne({ where: { product_id: product.uuid, filename } });
            if (image) {
                const filePath = path.join(__dirname, '..', '..','uploads', image.disk_filename);
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                await image.destroy();
            }
        }

        // 4️⃣ Handle new uploaded files
        const files = req.files || [];
        const existingImages = await Product_image.findAll({ where: { product_id: product.uuid } });

        // Ensure main image rules
        const mainExists = existingImages.some(img => img.image_type === 'main');
        const newMainCount = files.filter(f => (req.body[`image_type_${f.originalname}`] || 'sup') === 'main').length;

        if (mainExists && newMainCount > 0) {
            return res.status(400).json({ message: "A main image already exists. Cannot add another main image." });
        }

        // Optional: enforce max sub images (e.g., 10)
        const existingSubCount = existingImages.filter(img => img.image_type === 'sup').length;
        const newSubCount = files.filter(f => (req.body[`image_type_${f.originalname}`] || 'sup') === 'sup').length;
        if (existingSubCount + newSubCount > 12) {
            return res.status(400).json({ message: "Too many sub images. Maximum allowed is 12." });
        }

        // 5️⃣ Create new images
        let createdImages = [];
        if (files.length > 0) {
            createdImages = await Promise.all(
                files.map(f => Product_image.create({
                    product_id: product.uuid,
                    image_type: req.body[`image_type_${f.originalname}`] || 'sup',
                    filename: f.publicUrl,       // full public URL stored in filename field (if you insist)
                    disk_filename: f.filename,
                }))
            );
        }

        // 6️⃣ Return updated product and images
        const finalImages = await Product_image.findAll({ where: { product_id: product.uuid } });
        res.status(200).json({ message: "Product updated successfully", product, images: finalImages });

    } catch (err) {
        console.error(err);
        // remove uploaded files on error
        if (req.files) {
            for (let f of req.files) {
                const filePath = path.join(__dirname, '..','..', 'uploads', f.filename);
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            }
        }
        res.status(500).json({ message: err.message });
    }
};



//////4 
exports.createProductWithImages = async (req, res) => {
  try {
    const {
      cat, user, status, condition, currency, title, quantity,
      active_name, active_number, active_prcie, available, featured,
      upcoming, negotiable, warranty, warranty_peroid, latest,
      discount, price, original_price, metadata,description,attribute_option_ids=[]
    } = req.body;

    if (!title || !cat || !user) return res.status(400).json({ message: "Missing required product fields" });

    // 1️⃣ Create the product first
    const slug = generateSlug(title);
    const product = await Product.create({
      category_id: cat,
      user_id: user,
      status_id: status,
      condition_id: condition,
      currency_id: currency,
      title,
      slug,
      stock_quantity_fy: quantity,
      isactive_name: active_name,
      isactive_phonenumber: active_number,
      isactive_price: active_prcie,
      isAvailable: available,
      featured,
      upcoming,
      negotiable,
      warranty,
      warranty_peroid,
      latest,
      discount,
      price,
      original_price,
      metadata,description
    });

    // 2️⃣ Handle uploaded files
    const files = req.files || [];
    if (files.length > 0) {
      // Check if there is more than one main image
      const mainCount = files.filter(f => (req.body[`image_type_${f.originalname}`] || 'sup') === 'main').length;
      if (mainCount > 1) {
        // Delete uploaded files to avoid orphaned files
        for (let f of files) fs.existsSync(f.path) && fs.unlinkSync(f.path);
        return res.status(400).json({ message: "Only one main image is allowed" });
      }

      // Create images
      const createdImages = await Promise.all(
        files.map(f => Product_image.create({
          product_id: product.uuid,
          image_type: req.body[`image_type_${f.originalname}`] || 'sup',
          filename: f.publicUrl,
           disk_filename: f.filename,
        }))
      );
      let createdoptions;
      if(attribute_option_ids && attribute_option_ids.length>0)
       createdoptions = await Promise.all(
        files.map(f => Product_attribute.create({
          product_id: product.uuid,
          attribute_option_id: f.attribute_option_id,
          is_filteractive: f.is_filteractive
        }))
      );

      return res.status(201).json({ product, images: createdImages });
    }

    // 3️⃣ No files uploaded
    res.status(201).json({ product, images: [] });

  } catch (error) {
    // Delete files if product creation failed
    if (req.files) {
      for (let f of req.files) {
        const filePath = path.join(__dirname, '..','..', 'uploads', f.filename);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
    }
    
    res.status(400).json({ error: error.message });
  }
};
exports.justgetall=async(req,res)=>{
  try {
    const products=await Product.findAll({attributes:["uuid","title","slug"],raw:true });
    res.status(200).json (products);
  } catch (error) {
     res.status(500).json({ error: error.message });
  }
}
exports.justgettheall=async(req,res)=>{
  try {
    const products=await Product.findAll({raw:true,nest:true     ,include: [
        { model: Category, attributes: ["uuid", "name", "slug","softdelete"] },
        { model: Currency, attributes: ["currency_iso", "symbol","name"] },
        { model: Product_image, attributes: ["id","filename", "image_type"] },
        { model: User, attributes: ["name","username","role_id","status_id", "email", "phone_number"] }
        ,{model: Product_condition},{model: Product_statu}
        ,{model : Product_attribute, attributes:['isfilteractive',"id"],include:[{model:Attribute_option ,attributes:["id","name"],include:[{model:Attribute_type,attributes:["id",'name']}]}] }

      ]});
    res.status(200).json (products);
  } catch (error) {
     res.status(500).json({ error: error.message });
  }
}


exports.filterproducts=async(req,res)=>{
  try {
    const {
      page=1,
      limit=10,
      orderby,
      id,
      category_ids,
      user_id,
      status_id,
      condition_id,
      currency,
      title,
      product_slug,
      slugs,
      quantity_foryou,
      quantity_dir='eq',
      isactive_name,
      isactive_phonenumber,
      isactive_price,
      isAvailable,
      featured,
      upcoming,
      negotiable,
      warranty,
      warranty_period,
      warranty_period_dir='eq',
      latest,
      discount,
      price,
      price_dir='eq',
      original_price,
      original_price_dir="eq",
      includedeletedcategory,
      onlyDeletedCategory ,
      softdelete,
    attribute_option_ids:[]
    }=req.body;
    page=parseInt(page);
    limit=parseInt(limit);
    const offset=(page-1)*limit;
    let order=orderMapM[orderby]||orderMapM["created-desc"];
let where = {};
if (id) where.uuid = id;
if (user_id) where.user_id = user_id;
if (status_id) where.status_id = status_id;
if (condition_id) where.condition_id = condition_id;
if (currency) where.currency_id = currency;
if (title) where.title = { [Op.like]: `%${title}%` };
if (product_slug) where.slug = { [Op.like]: `%${product_slug}%` };
if (quantity_foryou !== undefined && quantity_dir) {
  switch (quantity_dir) {
    case "eq": // equal
      where.stock_quantity_fy = { [Op.eq]: quantity_foryou };
      break;
    case "gte": // greater or equal
      where.stock_quantity_fy = { [Op.gte]: quantity_foryou };
      break;
    case "lte": // less or equal
      where.stock_quantity_fy = { [Op.lte]: quantity_foryou };
      break;
    case "gt": // strictly greater
      where.stock_quantity_fy = { [Op.gt]: quantity_foryou };
      break;
    case "lt": // strictly lower
      where.stock_quantity_fy = { [Op.lt]: quantity_foryou };
      break;
    default:
      where.stock_quantity_fy = { [Op.eq]: quantity_foryou };
      break;
  }
}
if (warranty_period !== undefined && warranty_period_dir) {
  switch (warranty_period_dir) {
    case "eq":
      where.warranty_period = { [Op.eq]: warranty_period };
      break;
    case "gte":
      where.warranty_period = { [Op.gte]: warranty_period };
      break;
    case "lte":
      where.warranty_period = { [Op.lte]: warranty_period };
      break;
    case "gt":
      where.warranty_period = { [Op.gt]: warranty_period };
      break;
    case "lt":
      where.warranty_period = { [Op.lt]: warranty_period };
      break;
    default:
      where.warranty_period = { [Op.eq]: warranty_period };
      break;
  }
}
if (price !== undefined && price_dir) {
  switch (price_dir) {
    case "eq": where.price = { [Op.eq]: price }; break;
    case "gte": where.price = { [Op.gte]: price }; break;
    case "lte": where.price = { [Op.lte]: price }; break;
    case "gt": where.price = { [Op.gt]: price }; break;
    case "lt": where.price = { [Op.lt]: price }; break;
    default :where.price = { [Op.eq]: price }; break;
  }
}
if (original_price !== undefined && original_price_dir) {
  switch (original_price_dir) {
    case "eq": where.original_price = { [Op.eq]:original_price }; break;
    case "gte": where.original_price = { [Op.gte]: original_price }; break;
    case "lte": where.original_price = { [Op.lte]: original_price }; break;
    case "gt": where.original_price = { [Op.gt]: original_price }; break;
    case "lt": where.original_price = { [Op.lt]: original_price }; break;
    default: where.original_price = { [Op.eq]:original_price }; break;
  }
}
if (isactive_name !== undefined) where.isactive_name = isactive_name;
if (isactive_phonenumber !== undefined) where.isactive_phonenumber = isactive_phonenumber;
if (isactive_price !== undefined) where.isactive_price = isactive_price;
if (isAvailable !== undefined) where.isAvailable = isAvailable;
if (featured !== undefined) where.featured = featured;
if (upcoming !== undefined) where.upcoming = upcoming;
if (negotiable !== undefined) where.negotiable = negotiable;
if (warranty !== undefined) where.warranty = warranty;
if (latest !== undefined) where.latest = latest;
if (discount !== undefined) where.discount = discount;

if (price) where.price = { [Op.lte]: price }; // products less than or equal to given price
if (original_price) where.original_price = { [Op.lte]: original_price };

if (softdelete !== undefined) where.softdelete = softdelete;
    let rootCats=[];
    let allIds=[];
    
    if (slugs && slugs.length > 0) {
      rootCats = await Category.findAll({
        where: { slug: { [Op.in]: slugs } }
      });
    } else if (req.body.category_ids && req.body.category_ids.length > 0) {
      rootCats = await Category.findAll({
        where: { uuid: { [Op.in]: category_ids } }
      });
    }

    for (const cat of rootCats) {
      const ids = await getAllCategoryIds(cat.uuid); // your helper
      allIds.push(...ids);
    }
    allIds = [...new Set(allIds)];

    let categoryWhere = {};

    // softdelete filter logic
    if (includedeletedcategory === true) {
      // no filter, get both deleted and non-deleted
    } else if (includedeletedcategory === false) {
      categoryWhere.softdelete = 0; // only not deleted
    } else if (onlyDeletedCategory === true) {
      categoryWhere.softdelete = 1; // only deleted
    }

    // filter by allIds if present
    if (allIds && allIds.length > 0) {
      categoryWhere.uuid = { [Op.in]: allIds };
    }

    const includeOptions = [
    {
      model: Category,
      required: true,
      where: categoryWhere,
      attributes: [ 'name', 'slug',"uuid"]
    },
    {
      model: Currency,
      required: true,
      attributes: ['currency_iso', 'symbol'] // فقط الـ ID والرمز
    },
      {model:Product_image,
        attributes: ['filename'],
        where: { image_type: 'main' },
        required: false
    },
  ];

  // إضافة الـ attributes filter إذا موجود
  if (attribute_option_ids.length > 0) {
    includeOptions.push({
      model: Product_attribute,
      required: true,
      where: {
        attribute_option_id: { [Op.in]: attribute_option_ids }
      },
      attributes: []
    });
  }

    const queryOptions = {
    where,
    include: includeOptions,
    group: ['Product.uuid'],
    order,
    limit,
    offset,
    subQuery: false
    ,raw:true,
    nest:true
  };
  if (attribute_option_ids.length > 0) {
    queryOptions.having = Sequelize.literal(
      `COUNT(DISTINCT "Product_attributes"."attribute_option_id") = ${attribute_option_ids.length}`
    );
  }
  const { count, rows } = await Product.findAndCountAll(queryOptions);
  if(!count || !rows)return res.status(404).json({error:"didn't found any product",msg:""});

  return res.status(200).json({
      products: rows,
      total: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

exports.justtheproduct = async (req, res) => {
  try {
    const { id } = req.body; 
    const product = await Product.findOne({
      where: { uuid: id},
      exclude: [ "condition_id","status_id","user_id"],
      include: [
        { model: Category, attributes: ["uuid", "name", "slug"] },
        { model: Currency, attributes: ["currency_iso", "symbol"] },
        { model: Product_image, attributes: ["filename", "image_type"] },
        { model: User, attributes: ["username", "email", "phone_number"] },
        {model : Product_attribute, attributes:['isfilteractive',"id"],include:[{model:Attribute_option ,attributes:["id","name"],include:[{model:Attribute_type,attributes:["id",'name']}]}] }
              ],
    });
    if (!product) return res.status(404).json({ error: "Product not found" });
    const productData = product.toJSON();
    if (!productData.isactive_price) {
      delete productData.price;
      delete productData.original_price;
    }
    if (productData.User) {
      if (!productData.isactive_name) delete productData.User.username;
      if (!productData.isactive_phonenumber) delete productData.User.phone_number;
    }
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({
      succes: true,
      product: productData,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


exports.justalltheproduct = async (req, res) => {
  try {
    const { id } = req.body; 
    const product = await Product.findOne({
      where: { uuid: id},
      include: [
        { model: Category, attributes: ["uuid", "name", "slug","softdelete"] },
        { model: Currency, attributes: ["currency_iso", "symbol","name"] },
        { model: Product_image, attributes: ["id","filename", "image_type"] },
        { model: User, attributes: ["name","username","role_id","status_id", "email", "phone_number"] }
        ,{model: Product_condition},{model: Product_statu}
        ,{model : Product_attribute, attributes:['isfilteractive',"id"],include:[{model:Attribute_option ,attributes:["id","name"],include:[{model:Attribute_type,attributes:["id",'name']}]}] }

      ],
      raw:true,
      nest:true,
    });
    if (!product) return res.status(404).json({ error: "Product not found" ,msg:""});
    const productData = product.toJSON();
    res.json({
      succes: true,
      product: productData,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
