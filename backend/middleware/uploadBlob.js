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
    // Benzersiz dosya adı oluştur
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(req.file.originalname);
    const name = path.basename(req.file.originalname, ext).replace(/\s+/g, '-');
    const filename = `${name}-${uniqueSuffix}${ext}`;

    console.log('📤 Uploading to Vercel Blob:', filename);
    console.log('Environment check:', {
      hasToken: !!process.env.BLOB_READ_WRITE_TOKEN,
      nodeEnv: process.env.NODE_ENV,
      vercel: process.env.VERCEL
    });

    // Vercel Blob'a yükle - token'ı otomatik algılasın
    const blob = await put(filename, req.file.buffer, {
      access: 'public',
      // Token'ı belirtmiyoruz - Vercel otomatik algılayacak
    });

    console.log('✅ Upload successful:', blob.url);

    // req.file'ı güncelle - path yerine Blob URL
    req.file.path = blob.url;
    req.file.blobUrl = blob.url;

    next();
  } catch (error) {
    console.error('❌ Blob upload error:', error.message);
    console.error('Full error:', error);
    next(error);
  }
};

module.exports = { upload, uploadToBlob };
