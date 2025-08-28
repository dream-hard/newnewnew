
// middlewares/uploadMiddleware.js
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const BASE_URL = process.env.BASE_URL || 'https://cortex-7.com'; // set in .env in production
const UPLOADS_DIR = path.join(__dirname, '../../uploads');

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/; // recommend avoid gif if you don't handle animation
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) return cb(null, true);
    cb(new Error('Only image files are allowed'));
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// ensure uploads dir exists
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const autoProcessImages = async (req, res, next) => {
  if (!req.files || req.files.length === 0) return next();

  const processedFiles = [];

  for (let file of req.files) {
    const baseName = path.parse(file.originalname).name
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9-_]/g, '')
      .toLowerCase();
    const filename = `${Date.now()}-${baseName}.jpg`;
    const filepath = path.join(UPLOADS_DIR, filename);

    await sharp(file.buffer)
      .resize({ width: 600 })
      .jpeg({ quality: 80 })
      .toFile(filepath);

    const publicUrl = `${BASE_URL}/uploads/${encodeURIComponent(filename)}`;

    processedFiles.push({
      originalname: file.originalname,
      filename,      // actual disk filename
      publicUrl      // full public path (what you asked to store)
    });
  }

  // replace req.files with processed info
  req.files = processedFiles;

  next();
};


module.exports = { upload, autoProcessImages };
