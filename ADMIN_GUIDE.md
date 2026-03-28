# Portfolio Admin Panel - Kullanım Kılavuzu

## 🚀 Başlangıç

### Backend'i Başlatma
```bash
cd backend
npm start
```
Backend `http://localhost:3000` adresinde çalışacak.

### Frontend'i Başlatma
```bash
cd client
npm run dev
```
Frontend `http://localhost:5174` adresinde çalışacak.

## 📋 Admin Panel Özellikleri

Admin paneline sağ üstteki **🔧 Admin Paneli** butonuna tıklayarak erişebilirsiniz.

### 1. Profil Yönetimi
Kişisel bilgilerinizi buradan düzenleyebilirsiniz:
- **İsim & Ünvan**: Adınız ve başlığınız (örn: Software Developer)
- **Biyografi**: Hakkınızda kısa açıklama
- **İletişim**: Email, telefon, konum
- **Avatar URL**: Profil fotoğrafınızın URL'i
- **CV URL**: CV dosyanızın URL'i
- **Sosyal Medya**: GitHub, LinkedIn, Twitter, Website linkleri
- **Tech Stack**: Kullandığınız teknolojiler (JS, React, Node.js vb.)

### 2. Proje Yönetimi
Projelerinizi ekleyin, düzenleyin ve silin:
- **Başlık**: Proje adı
- **Açıklama**: Proje hakkında kısa bilgi
- **Kategori**: Web, Game veya Tools
- **Tags**: Projede kullanılan teknolojiler (React, Node.js vb.)
- **Link**: Canlı demo linki
- **GitHub URL**: GitHub repository linki
- **Görsel URL**: Proje görseli URL'i
- **Sıra**: Projelerin görüntülenme sırası (düşükten yükseğe)
- **Aktif**: Proje ana sayfada görünsün mü?

### 3. Servis Yönetimi
Sunduğunuz hizmetleri yönetin:
- **Başlık**: Servis adı (örn: Web Development)
- **Açıklama**: Servis detayları
- **İkon**: Emoji ikon (💻, 🎮, 🎨 vb.)
- **Fiyat**: Min-Max fiyat aralığı ve para birimi
- **Özellikler**: Servise dahil olan özellikler listesi
- **Sıra**: Servislerin görüntülenme sırası
- **Aktif**: Servis ana sayfada görünsün mü?

## 🔧 API Endpoints

### Profile
- `GET /api/profile` - Profil bilgilerini getir
- `POST /api/profile` - Yeni profil oluştur
- `PUT /api/profile/:id` - Profili güncelle

### Projects
- `GET /api/projects` - Tüm projeleri getir
- `GET /api/projects/:id` - Belirli bir projeyi getir
- `POST /api/projects` - Yeni proje ekle
- `PUT /api/projects/:id` - Projeyi güncelle
- `DELETE /api/projects/:id` - Projeyi sil

### Services
- `GET /api/services` - Tüm servisleri getir
- `GET /api/services/active` - Aktif servisleri getir
- `GET /api/services/:id` - Belirli bir servisi getir
- `POST /api/services` - Yeni servis ekle
- `PUT /api/services/:id` - Servisi güncelle
- `DELETE /api/services/:id` - Servisi sil

## 💡 İpuçları

1. **Görsel URL'leri**: Görselleri [Imgur](https://imgur.com) veya [Cloudinary](https://cloudinary.com) gibi servislere yükleyip URL'lerini kullanabilirsiniz.

2. **CV Dosyası**: CV'nizi Google Drive veya Dropbox'a yükleyip paylaşım linkini kullanabilirsiniz.

3. **Emoji İkonlar**: Servislerde emoji kullanırken Windows'ta `Win + .` veya Mac'te `Cmd + Ctrl + Space` ile emoji panelini açabilirsiniz.

4. **Sıralama**: Sıra numarası düşük olan öğeler önce gösterilir (0, 1, 2...).

5. **Aktif/Pasif**: Henüz tamamlanmamış projeler veya servisleri "Aktif" işaretini kaldırarak gizleyebilirsiniz.

## 🎨 Tema Renkleri

- **Ana Arkaplan**: #0a0a0a (Koyu siyah)
- **Kart Arkaplan**: rgba(30, 30, 35, 0.6)
- **Vurgu Rengi**: #3b4c7f (Mavi-mor)
- **Metin**: #e5e5e5 (Açık gri)
- **İkincil Metin**: #a0a0a0 (Gri)

## 🔐 Güvenlik Notu

⚠️ **ÖNEMLİ**: Admin paneli şu anda kimlik doğrulaması içermiyor. Production'a almadan önce mutlaka:
- Kimlik doğrulama sistemi ekleyin (JWT, OAuth vb.)
- Admin route'larını koruma altına alın
- CORS ayarlarını production domain'inize göre güncelleyin

## 📱 Responsive Tasarım

Admin panel mobil cihazlarda da kullanılabilir. Tablet ve mobil görünümler için optimize edilmiştir.

## 🐛 Sorun Giderme

**Backend bağlantı hatası alıyorum:**
- Backend'in çalıştığından emin olun (`npm start`)
- MongoDB'nin çalıştığından emin olun
- Port 3000'in başka bir uygulama tarafından kullanılmadığını kontrol edin

**Verilerim kayboldu:**
- MongoDB veritabanı çalışıyor mu kontrol edin
- `.env` dosyasında MongoDB connection string doğru mu?

**CORS hatası:**
- `backend/app.js` dosyasında frontend URL'iniz izin verilen originler listesinde mi?
