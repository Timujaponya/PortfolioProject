# 🚀 Netlify Deployment Guide

## Netlify ile Full-Stack Deployment

Netlify, frontend + serverless functions ile backend'i birlikte host edebilir.

---

## 📋 Hazırlık Adımları

### 1. MongoDB Atlas Setup (Ücretsiz)

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) hesabı aç
2. **Create Cluster** → M0 Free Tier seç
3. **Database Access** → Kullanıcı oluştur:
   - Username: `portfolio_user`
   - Password: Güçlü bir şifre (kaydet!)
   
4. **Network Access** → IP Whitelist:
   - `0.0.0.0/0` ekle (her yerden erişim - Netlify için gerekli)

5. **Connect** → Drivers → Connection string kopyala:
   ```
   mongodb+srv://portfolio_user:PASSWORD@cluster0.xxxxx.mongodb.net/portfolio?retryWrites=true&w=majority
   ```

---

## 🎨 Netlify Deployment Seçenekleri

### **Seçenek 1: Sadece Frontend (Önerilen - Basit)**

Backend'i ayrı bir serviste (Render/Railway) host et.

#### Adımlar:

1. **[Netlify](https://netlify.com)** hesabı aç
2. **Add new site** → Import from Git
3. GitHub'dan `PortfolioProject` repo'nuzu seç
4. Build ayarları:
   ```
   Base directory: client
   Build command: npm run build
   Publish directory: client/dist
   ```

5. **Environment Variables** ekle:
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   VITE_ADMIN_PASSWORD=your_secure_password_here
   VITE_ADMIN_PATH=/timucin-secret-admin-xyz789
   ```

6. **Deploy** butonuna tıkla!

#### Backend için Render kullanın:
- Backend için [DEPLOYMENT.md](./DEPLOYMENT.md) dosyasındaki Render adımlarını izleyin
- Render ücretsiz ve backend için mükemmel

---

### **Seçenek 2: Netlify Functions (Full-Stack)**

Netlify Functions ile backend'i de Netlify'da host edin.

#### Adım 1: Backend'i Netlify Functions'a Çevirme

Yeni klasör oluştur:

```bash
mkdir netlify
mkdir netlify/functions
```

#### Adım 2: Backend kodunu function'a çevir

`netlify/functions/api.js` oluştur:

```javascript
const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const { connectDb } = require('../../backend/config/db');

// Express app oluştur
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const profileRoutes = require('../../backend/routes/profile');
const projectsRoutes = require('../../backend/routes/projects');
const servicesRoutes = require('../../backend/routes/services');

app.use('/api/profile', profileRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/services', servicesRoutes);

// MongoDB bağlantısı
connectDb();

// Serverless handler
module.exports.handler = serverless(app);
```

#### Adım 3: netlify.toml yapılandırması

Root dizinde `netlify.toml` oluştur:

```toml
[build]
  base = "client"
  command = "npm run build"
  publish = "client/dist"
  functions = "netlify/functions"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### Adım 4: Dependency ekleme

Root `package.json` güncelleyin:

```json
{
  "dependencies": {
    "serverless-http": "^3.2.0"
  }
}
```

Install:
```bash
npm install serverless-http
```

#### Adım 5: Netlify Environment Variables

Netlify Dashboard → Site Settings → Environment Variables:

```
MONGODB_URI=mongodb+srv://...
GITHUB_TOKEN=ghp_your_token
NODE_ENV=production
VITE_API_URL=/.netlify/functions/api
VITE_ADMIN_PASSWORD=your_password
VITE_ADMIN_PATH=/your-secret-path
```

---

## 🚀 Kolay Yöntem (ÖNERİLEN)

### Frontend: Netlify
### Backend: Render

**Neden?**
- ✅ Daha kolay setup
- ✅ Ayrı ayrı scale edilebilir
- ✅ Backend her zaman ayakta (Netlify Functions cold start yapar)
- ✅ Ücretsiz tier'da daha iyi performans

### Adımlar:

#### 1. Backend'i Render'a Deploy Et

```bash
# Render.com hesabı aç
# New → Web Service
# GitHub repo bağla
```

Ayarlar:
```
Name: portfolio-backend
Root Directory: backend
Build Command: npm install
Start Command: node server.js
```

Environment Variables:
```
MONGODB_URI=your_mongodb_connection
PORT=3000
GITHUB_TOKEN=your_token
NODE_ENV=production
```

Backend URL'nizi alın: `https://portfolio-backend-abc.onrender.com`

#### 2. Frontend'i Netlify'a Deploy Et

```bash
# Netlify.com hesabı aç
# Add new site → Import from Git
```

Ayarlar:
```
Base directory: client
Build command: npm run build
Publish directory: client/dist
```

Environment Variables:
```
VITE_API_URL=https://portfolio-backend-abc.onrender.com/api
VITE_ADMIN_PASSWORD=your_password
VITE_ADMIN_PATH=/your-secret-path
```

---

## 🔧 netlify.toml (Sadece Frontend)

Root dizinde `netlify.toml` oluştur:

```toml
[build]
  base = "client"
  command = "npm run build"
  publish = "client/dist"

[build.environment]
  NODE_VERSION = "18"

# SPA routing için
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# Cache headers
[[headers]]
  for = "/*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

---

## 📦 Deploy Komutları

```bash
# Değişiklikleri commit et
git add .
git commit -m "feat: add Netlify deployment config"
git push origin main

# Netlify otomatik deploy eder!
```

---

## 🌐 Custom Domain

### Netlify'da:
1. **Domain settings** → Add custom domain
2. Domain'inizi girin (örn: `timucin.dev`)
3. DNS kayıtlarını güncelleyin:
   ```
   Type: A
   Name: @
   Value: 75.2.60.5
   
   Type: CNAME
   Name: www
   Value: your-site.netlify.app
   ```

### SSL:
Netlify otomatik Let's Encrypt SSL sertifikası ekler (ücretsiz!)

---

## 🐛 Troubleshooting

### Build Hatası:
```bash
# Lokalde test et:
cd client
npm run build
```

### API Bağlantı Hatası:
- Environment variables doğru mu?
- Backend URL'i `https://` ile mi başlıyor?
- CORS ayarları yapıldı mı?

### MongoDB Bağlantı Hatası:
- IP whitelist: `0.0.0.0/0`
- Connection string doğru mu?
- Username/password doğru mu?

---

## ✅ Deployment Checklist

- [ ] MongoDB Atlas cluster oluşturuldu
- [ ] Backend Render'a deploy edildi
- [ ] Frontend Netlify'a deploy edildi
- [ ] netlify.toml oluşturuldu
- [ ] Environment variables set edildi
- [ ] Custom domain bağlandı (opsiyonel)
- [ ] SSL aktif
- [ ] Admin panel çalışıyor
- [ ] GitHub webhook aktif (auto-deploy için)

---

## 🎯 Sonuç

**Frontend URL:** `https://timucin-portfolio.netlify.app`
**Backend URL:** `https://portfolio-backend.onrender.com`
**Admin Panel:** `https://timucin-portfolio.netlify.app/timucin-secret-admin-xyz789`

**Auto-Deploy:**
- Main branch'e push → Otomatik deploy
- Dev branch → Preview deploy (Netlify Branch Deploys)

Tebrikler! 🎉
