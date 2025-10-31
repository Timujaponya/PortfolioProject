const multer = require('multer');
const path = require('path');
const { put } = require('@vercel/blob');

// Multer memory storage - dosyaları belleğe al
const storage = multer.memoryStorage();

// Dosya filtresi - resim, SVG ve PDF dosyaları
const fileFilter = (req, file, cb) => {
  const allowedImageTypes = /jpeg|jpg|png|gif|webp|svg/;
  const allowedDocTypes = /pdf/;
  const extname = path.extname(file.originalname).toLowerCase();
  const isImage = allowedImageTypes.test(extname) && (allowedImageTypes.test(file.mimetype) || file.mimetype === 'image/svg+xml');
  const isPDF = allowedDocTypes.test(extname) && file.mimetype === 'application/pdf';

  if (isImage || isPDF) {
    return cb(null, true);
  } else {
    cb(new Error('Sadece resim (jpeg, jpg, png, gif, webp, svg) veya PDF dosyaları yüklenebilir!'));
  }
};

// Multer instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

// Vercel Blob'a upload eden middleware
const uploadToBlob = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    
    // Debug: Token var mı kontrol et
    if (!token) {
      console.error('❌ BLOB_READ_WRITE_TOKEN not found in environment variables');
      console.log('Available env vars:', Object.keys(process.env).filter(k => k.includes('BLOB')));
      throw new Error('BLOB_READ_WRITE_TOKEN environment variable is not set');
    }

    // Benzersiz dosya adı oluştur
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(req.file.originalname);
    const name = path.basename(req.file.originalname, ext).replace(/\s+/g, '-');
    const filename = `${name}-${uniqueSuffix}${ext}`;

    console.log('📤 Uploading to Vercel Blob:', filename);

    // Vercel Blob'a yükle
    const blob = await put(filename, req.file.buffer, {
      access: 'public',
      token: token,
    });

    console.log('✅ Upload successful:', blob.url);

    // req.file'ı güncelle - path yerine Blob URL
    req.file.path = blob.url;
    req.file.blobUrl = blob.url;

    next();
  } catch (error) {
    console.error('❌ Blob upload error:', error.message);
    next(error);
  }
};

module.exports = { upload, uploadToBlob };
