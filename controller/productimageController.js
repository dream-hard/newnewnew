const fs = require('fs');
const path = require('path');
const Product_image = require("../models/_product_images.js");
const Product = require("../models/_products.js");

const image_types=Product_image.image_type_values;

exports.create = async (req, res) => {
  try {
    const {product_id,image_type,path}=req.body;

    const image = await Product_image.create({
      product_id,
      image_type,
      filename:path,
    });
    res.status(201).json(image);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const images = await Product_image.findAll();
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const {id}=req.body;

    const image = await Product_image.findByPk(id);
    if (!image) return res.status(404).json({ error: "Not found" });
    res.json(image);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getallbytype = async (req, res) => {
  try {
    const {image_type}=req.body;
    const image = await Product_image.findAll({where:{
      image_type:image_type,
    }});
    if (!image) return res.status(404).json({ error: "Not found" });
    res.json(image);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getByProductId = async (req, res) => {
  try {
    const {product_id}=req.body;
    const product= await Product.findByPk(product_id);
    if(!product)res.status(401).json({error:"NOT FOUND PRODUCT"});
    
    const image = await Product_image.findAll({where:{
      product_id:product_id,
    }});
    if (!image) return res.status(404).json({ error: "this product hasn't any image" });
    res.json(image);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getByProductIdAndType = async (req, res) => {
  try {
    const {product_id,image_type}=req.body;
    const product= await Product.findByPk(product_id);
    if(!product)res.status(401).json({error:"NOT FOUND PRODUCT"});
    
    const image = await Product_image.findAll({where:{
      product_id:product_id,
      image_type:image_type,
    }});
    if (!image) return res.status(404).json({ error: "this product hasn't any image" });
    res.json(image);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};





///////5
exports.updateOrCreateImages = async (req, res) => {
    try {
        const { product_id, delete_filenames = [] } = req.body;

        if (!product_id) return res.status(400).json({ message: "Missing product_id" });

        const files = req.files || [];

        // 1️⃣ Delete old images by filename
        for (let filename of delete_filenames) {
            const image = await Product_image.findOne({ where: { product_id, filename } });
            if (image) {
                const filePath = path.join(__dirname, '..', 'uploads', image.filename);
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                await image.destroy();
            }
        }

        // 2️⃣ Get current images after deletion
        const existingImages = await Product_image.findAll({ where: { product_id } });

        // 3️⃣ Check main image constraint
        const mainImageExists = existingImages.some(img => img.image_type === 'main');
        const newMainCount = files.filter(file => {
            const type = req.body[`image_type_${file.originalname}`] || 'sup';
            return type === 'main';
        }).length;

        if (mainImageExists && newMainCount > 0) {
            return res.status(400).json({ message: "A main image already exists. Cannot add another main image." });
        }

        // 4️⃣ Validate total sub-images (example max 10)
        const remainingSubImages = existingImages.filter(img => img.image_type === 'sup');
        const newSubImagesCount = files.filter(file => {
            const type = req.body[`image_type_${file.originalname}`] || 'sup';
            return type === 'sup';
        }).length;

        if (remainingSubImages.length + newSubImagesCount > 10) {
            return res.status(400).json({ message: "Too many sub images. Maximum allowed is 10." });
        }

        // 5️⃣ Create new images if any
        let createdImages = [];
        if (files.length > 0) {
            createdImages = await Promise.all(
                files.map(file => {
                    const type = req.body[`image_type_${file.originalname}`] || 'sup';
                    return Product_image.create({
                        product_id,
                        image_type: type,
                        filename: file.filename
                    });
                })
            );
        }

        // 6️⃣ Ensure at least one main image exists after update
        const finalImages = await Product_image.findAll({ where: { product_id } });
        if (!finalImages.some(img => img.image_type === 'main')) {
            return res.status(400).json({ message: "Product must have at least one main image." });
        }

        res.status(200).json({
            message: createdImages.length ? "Images updated/created" : "No new images uploaded",
            images: finalImages
        });

    } catch (err) {

        // Remove uploaded files if something fails
        if (req.files) {
            for (let file of req.files) {
                const filePath = path.join(__dirname, '..', 'uploads', file.filename);
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            }
        }

        res.status(500).json({ message: err.message });
    }
};


exports.deleteProductImage = async (req, res) => {
    try {
        const { id } = req.body;
        const image = await Product_image.findByPk(id);
        if (!image) return res.status(404).json({ message: "Image not found" });

        // remove file from uploads
        const filePath = path.join(__dirname, '..', 'uploads', image.filename);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        await image.destroy();
        res.status(200).json({ message: "Image deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


///////4
exports.updateProductImage = async (req, res) => {
    try {
        const { id } = req.params;
        const { image_type } = req.body;

        const image = await Product_image.findByPk(id);
        if (!image) return res.status(404).json({ message: "Image not found" });

        // update type if provided
        if (image_type) {
            image.image_type = image_type;
        }

        // replace file if new file uploaded
        if (req.file) {
            // delete old file
            const oldPath = path.join(__dirname, '..', 'uploads', image.filename);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);

            image.filename = req.file.filename;
        }

        await image.save();
        res.status(200).json({ message: "Image updated", image });
    } catch (err) {
 if (req.files) {
      for (let f of req.files) {
        const filePath = path.join(__dirname, '..', 'uploads', f.filename);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
    }        res.status(500).json({ message: err.message });
    }
};

///////2
exports.addProductImages = async (req, res) => {
    try {
        const { product_id, image_type } = req.body;

        if (!product_id || !image_type) return res.status(400).json({ message: "Missing fields" });

        if (!req.files || req.files.length === 0) return res.status(400).json({ message: "No files uploaded" });

        const createdImages = await Promise.all(
            req.files.map(file => Product_image.create({ product_id, image_type, filename: file.filename }))
        );

        res.status(201).json({ message: "Images added", images: createdImages });
    } catch (err) {
       if (req.files) {
      for (let f of req.files) {
        const filePath = path.join(__dirname, '..', 'uploads', f.filename);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
    }
      res.status(500).json({ message: err.message });
    }
};


// Slug generator
function generateSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')   // remove special characters
    .replace(/\s+/g, '-')           // replace spaces with hyphens
    .replace(/-+/g, '-')            // remove multiple hyphens
    .replace(/^-+|-+$/g, '');       // trim hyphens from start and end
}
///////1
exports.createProductWithImages = async (req, res) => {
  try {
    const {
      cat, user, status, condition, currency, title, quantity,
      active_name, active_number, active_prcie, available, featured,
      upcoming, negotiable, warranty, warranty_peroid, latest,
      discount, price, original_price, metadata
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
      metadata
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
          filename: f.filename
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
        const filePath = path.join(__dirname, '..', 'uploads', f.filename);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
    }
    res.status(400).json({ error: error.message });
  }
};
