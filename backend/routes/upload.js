const express = require('express');
const router = express.Router();
const { upload, uploadToBlob } = require('../middleware/uploadBlob');

// POST /api/upload - Tek dosya yükleme (resim veya PDF)
router.post('/', upload.single('file'), uploadToBlob, (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Dosya yüklenmedi!' });
    }

    // Vercel Blob URL'ini döndür
    const fileUrl = req.file.blobUrl;
    
    res.status(200).json({
      message: 'Dosya başarıyla yüklendi',
      url: fileUrl,
      filename: req.file.originalname,
      size: req.file.size
    });
  } catch (err) {
    res.status(500).json({ message: 'Dosya yükleme hatası', error: err.message });
  }
});

// POST /api/upload/icon - Icon yükleme (SVG, PNG, JPG)
router.post('/icon', upload.single('icon'), uploadToBlob, (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Icon dosyası yüklenmedi!' });
    }

    // Dosya tipini kontrol et
    const allowedTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ message: 'Sadece SVG, PNG, JPG veya WebP dosyaları yükleyebilirsiniz!' });
    }

    // Vercel Blob URL'ini döndür
    const iconUrl = req.file.blobUrl;
    
    res.status(200).json({
      message: 'Icon başarıyla yüklendi',
      url: iconUrl,
      filename: req.file.originalname,
      size: req.file.size
    });
  } catch (err) {
    res.status(500).json({ message: 'Icon yükleme hatası', error: err.message });
  }
});


// DELETE /api/upload - Vercel Blob'dan dosya silme
router.delete('/', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ message: 'Dosya URL\'si gerekli' });
    }

    // Vercel Blob'dan sil
    const { del } = require('@vercel/blob');
    await del(url, { token: process.env.BLOB_READ_WRITE_TOKEN });
    
    res.status(200).json({ message: 'Dosya silindi' });
  } catch (err) {
    res.status(500).json({ message: 'Dosya silme hatası', error: err.message });
  }
});

module.exports = router;
