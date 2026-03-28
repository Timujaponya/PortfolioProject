const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');

// POST /api/upload - Tek dosya yükleme (resim veya PDF)
router.post('/', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Dosya yüklenmedi!' });
    }

    // Dosya URL'ini döndür
    const fileUrl = `http://localhost:3000/uploads/${req.file.filename}`;
    
    res.status(200).json({
      message: 'Dosya başarıyla yüklendi',
      url: fileUrl,
      filename: req.file.filename,
      size: req.file.size
    });
  } catch (err) {
    res.status(500).json({ message: 'Dosya yükleme hatası', error: err.message });
  }
});

// POST /api/upload/icon - Icon yükleme (SVG, PNG, JPG)
router.post('/icon', upload.single('icon'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Icon dosyası yüklenmedi!' });
    }

    // Dosya tipini kontrol et
    const allowedTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      // Dosyayı sil
      const fs = require('fs');
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'Sadece SVG, PNG, JPG veya WebP dosyaları yükleyebilirsiniz!' });
    }

    // Icon URL'ini döndür
    const iconUrl = `http://localhost:3000/uploads/${req.file.filename}`;
    
    res.status(200).json({
      message: 'Icon başarıyla yüklendi',
      url: iconUrl,
      filename: req.file.filename,
      size: req.file.size
    });
  } catch (err) {
    res.status(500).json({ message: 'Icon yükleme hatası', error: err.message });
  }
});

// DELETE /api/upload/:filename - Dosya silme
router.delete('/:filename', (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../uploads', filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.status(200).json({ message: 'Dosya silindi' });
    } else {
      res.status(404).json({ message: 'Dosya bulunamadı' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Dosya silme hatası', error: err.message });
  }
});

module.exports = router;
