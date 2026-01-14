# Portfolio Projesi - Hızlı Başlangıç

## 🎯 Proje Yapısı

```
portfolio/
├── backend/          # Node.js + Express + MongoDB API
│   ├── models/       # Mongoose modelleri (Project, Profile, Service)
│   ├── controllers/  # İş mantığı kontrolcüleri
│   ├── services/     # Servis katmanı
│   ├── repositories/ # Veritabanı işlemleri
│   ├── routes/       # API route'ları
│   └── app.js        # Express uygulaması
│
└── client/           # React + TypeScript + Vite
    └── src/
        ├── App.tsx         # Ana portfolio sayfası
        ├── AdminPanel.tsx  # Admin yönetim paneli
        └── Router.tsx      # Sayfa yönlendirme
```

## 🚀 Kurulum ve Çalıştırma

### 1. Backend Başlatma
```bash
cd backend
npm install  # İlk kurulumda
npm start
```
✅ Backend: `http://localhost:3000`

### 2. Frontend Başlatma
```bash
cd client
npm install  # İlk kurulumda
npm run dev
```
✅ Frontend: `http://localhost:5174`

## 📊 Veritabanı Modelleri

### Profile (Profil Bilgileri)
- İsim, ünvan, biyografi
- İletişim (email, telefon, konum)
- Avatar & CV URL'leri
- Sosyal medya linkleri
- Tech stack

### Project (Projeler)
- Başlık, açıklama
- Kategori (web/game/tools)
- Tags (teknolojiler)
- Link & GitHub URL
- Görsel URL
- Sıralama & aktiflik

### Service (Hizmetler)
- Başlık, açıklama
- İkon
- Fiyat (min-max, para birimi)
- Özellikler listesi
- Sıralama & aktiflik

## 🎨 Özellikler

### Ana Sayfa (Portfolio)
- ✨ Modern koyu tema
- 🎯 Hero bölümü
- 👤 Hakkımda kartı
- 📁 Filtrelenebilir projeler
- 💼 Servisler showcase
- 📧 İletişim formu
- 📱 Responsive tasarım

### Admin Panel
- 📝 Profil düzenleme
- ➕ Proje ekleme/düzenleme/silme
- 🛠️ Servis yönetimi
- 🎯 Drag-free sıralama
- ✅ Aktif/Pasif kontrol

## 🔌 API Endpoints

**Profile:**
- GET `/api/profile`
- POST `/api/profile`
- PUT `/api/profile/:id`

**Projects:**
- GET `/api/projects`
- GET `/api/projects/:id`
- POST `/api/projects`
- PUT `/api/projects/:id`
- DELETE `/api/projects/:id`

**Services:**
- GET `/api/services`
- GET `/api/services/active`
- POST `/api/services`
- PUT `/api/services/:id`
- DELETE `/api/services/:id`

## 🎯 Admin Panele Erişim

1. Ana sayfada sağ üstteki **🔧 Admin Paneli** butonuna tıklayın
2. 3 sekme arasında geçiş yapın: Profil, Projeler, Servisler
3. Değişiklikleri yapın ve kaydedin

## 💡 Kullanım Örnekleri

### Yeni Proje Ekleme
1. Admin Panel → Projeler
2. Sağ taraftaki formu doldurun
3. "Kaydet" butonuna tıklayın

### Profil Güncelleme
1. Admin Panel → Profil
2. Bilgileri güncelleyin
3. Tech Stack'e yeni teknolojiler ekleyin
4. "Kaydet" butonuna tıklayın

### Servis Fiyatlandırma
1. Admin Panel → Servisler
2. Yeni servis ekleyin
3. Min-Max fiyat aralığı girin
4. Özellikler listesi ekleyin
5. "Kaydet" butonuna tıklayın

## 🔒 Güvenlik

⚠️ **Production öncesi yapılması gerekenler:**
- [ ] Kimlik doğrulama ekle (JWT/OAuth)
- [ ] Admin route'larını koru
- [ ] Environment variables düzenle
- [ ] CORS ayarlarını güncelle
- [ ] Rate limiting ekle
- [ ] Input validation güçlendir

## 📦 Teknolojiler

**Backend:**
- Node.js
- Express.js
- MongoDB + Mongoose
- CORS

**Frontend:**
- React 18
- TypeScript
- Vite
- CSS3 (Custom styling)

## 🎨 Tasarım Sistemi

- **Primary**: #3b4c7f (Mavi-mor)
- **Background**: #0a0a0a (Siyah)
- **Card BG**: rgba(30, 30, 35, 0.6)
- **Text**: #e5e5e5
- **Secondary Text**: #a0a0a0

