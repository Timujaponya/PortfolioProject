# Environment Setup Guide

## 📁 Required Files

### Backend (.env)
Create `/backend/.env` file with:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# GitHub API (optional)
GITHUB_TOKEN=your_github_token

# Server Config
PORT=3000
```

### Frontend (.env)
Create `/client/.env` file with:

```env
# API URL
VITE_API_URL=http://localhost:3000/api

# Admin Panel
VITE_ADMIN_PASSWORD=your_secure_password
VITE_ADMIN_PATH=/your-secret-admin-path
```

## 🔐 Security

**IMPORTANT:** Never commit `.env` files to Git!

- `.env` files are in `.gitignore`
- Use `.env.example` files as templates
- Change all default passwords
- Keep admin path secret

## 🚀 Quick Start

1. Copy example files:
```bash
cp backend/.env.example backend/.env
cp client/.env.example client/.env
```

2. Edit `.env` files with your credentials

3. Start development:
```bash
npm run dev
```

## 📝 Environment Variables Explained

### MONGODB_URI
- Get from MongoDB Atlas (cloud.mongodb.com)
- Create cluster → Get connection string
- Replace `<password>` and `<database>`

### GITHUB_TOKEN
- Optional, for GitHub integration
- Generate at: github.com/settings/tokens
- Select `repo` scope

### VITE_ADMIN_PASSWORD
- Your admin panel password
- Use strong password (letters + numbers + symbols)

### VITE_ADMIN_PATH
- Secret URL path for admin panel
- Example: `/my-secret-admin-123`
- Don't use common paths like `/admin`
