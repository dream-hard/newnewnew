// middlewares/uploadAdsMiddleware.js
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const BASE_URL = process.env.BASE_URL || "https://cortex-7.com";
const UPLOADS_DIR = path.join(__dirname, "..", "..", "uploads");
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) return cb(null, true);
    cb(new Error("Only image files are allowed (jpeg,jpg,png,webp)"));
  },
  limits: { fileSize: 15 * 1024 * 1024 } // 10MB
});

fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const autoProcessImages = async (req, res, next) => {
  try {
    let incoming = [];
    if (req.files && req.files.length) incoming = req.files;
    else if (req.file) incoming = [req.file];

    if (incoming.length === 0) return next();

    const processedFiles = [];

    for (let file of incoming) {
      const baseName = path.parse(file.originalname).name
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9-_]/g, "")
        .toLowerCase();
      const filename = `${Date.now()}-${baseName}.jpg`;
      const filepath = path.join(UPLOADS_DIR, filename);

      await fs.promises.writeFile(filepath, file.buffer);


      const publicUrl = `${BASE_URL}/uploads/${encodeURIComponent(filename)}`;

      processedFiles.push({
        originalname: file.originalname,
        filename,         // this is the disk_filename
        publicUrl,
        disk_filename: filename
      });
    }

    // replace with processed info
    req.files = processedFiles;
    next();
  } catch (err) {
    console.error("Image processing error:", err);
    return res.status(500).json({ error: "Image processing failed" });
  }
};

module.exports = {
  upload,
  autoProcessImages,
  UPLOADS_DIR,
};
