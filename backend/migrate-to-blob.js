// Local uploads klasöründeki dosyaları Vercel Blob'a yükle
require('dotenv').config();
const { put } = require('@vercel/blob');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Profile = require('./models/Profile');
const Project = require('./models/Project');

const uploadsDir = path.join(__dirname, 'uploads');

async function uploadFilesToBlob() {
    try {
        if (!process.env.BLOB_READ_WRITE_TOKEN) {
            console.error('❌ BLOB_READ_WRITE_TOKEN environment variable gerekli!');
            console.log('Vercel Dashboard → Storage → Blob → Connect to get token');
            process.exit(1);
        }

        // MongoDB'e bağlan
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB bağlantısı başarılı\n');

        // Uploads klasörü var mı kontrol et
        if (!fs.existsSync(uploadsDir)) {
            console.log('❌ Uploads klasörü bulunamadı');
            process.exit(1);
        }

        const files = fs.readdirSync(uploadsDir);
        console.log(`📁 ${files.length} dosya bulundu\n`);

        const urlMap = {}; // old URL -> new Blob URL mapping

        // Her dosyayı Blob'a yükle
        for (const filename of files) {
            const filePath = path.join(uploadsDir, filename);
            const fileBuffer = fs.readFileSync(filePath);
            
            console.log(`⏳ Yükleniyor: ${filename}...`);
            
            const blob = await put(filename, fileBuffer, {
                access: 'public',
                token: process.env.BLOB_READ_WRITE_TOKEN,
            });

            const oldUrl = `http://localhost:3000/uploads/${filename}`;
            const renderUrl = `https://portfolioproject-gigt.onrender.com/uploads/${filename}`;
            urlMap[oldUrl] = blob.url;
            urlMap[renderUrl] = blob.url;
            
            console.log(`   ✅ ${blob.url}\n`);
        }

        console.log('🔄 MongoDB URL\'lerini güncelleniyor...\n');

        // Profile URL'lerini güncelle
        const profile = await Profile.findOne();
        if (profile) {
            let updated = false;

            if (profile.avatarUrl && urlMap[profile.avatarUrl]) {
                profile.avatarUrl = urlMap[profile.avatarUrl];
                updated = true;
            }

            if (profile.cvUrl && urlMap[profile.cvUrl]) {
                profile.cvUrl = urlMap[profile.cvUrl];
                updated = true;
            }

            if (profile.techStack) {
                profile.techStack.forEach(tech => {
                    if (tech.icon && tech.icon.startsWith('custom:')) {
                        const iconUrl = tech.icon.replace('custom:', '');
                        if (urlMap[iconUrl]) {
                            tech.icon = `custom:${urlMap[iconUrl]}`;
                            updated = true;
                        }
                    }
                });
            }

            if (updated) {
                await profile.save();
                console.log('✅ Profile URL\'leri güncellendi');
            }
        }

        // Project URL'lerini güncelle
        const projects = await Project.find();
        let projectCount = 0;
        for (const project of projects) {
            if (project.imageUrl && urlMap[project.imageUrl]) {
                project.imageUrl = urlMap[project.imageUrl];
                await project.save();
                projectCount++;
            }
        }
        if (projectCount > 0) {
            console.log(`✅ ${projectCount} proje URL'i güncellendi`);
        }

        console.log('\n🎉 Tüm dosyalar Vercel Blob\'a yüklendi ve MongoDB güncellendi!');
        console.log('\n📋 URL Mapping:');
        Object.entries(urlMap).forEach(([old, newUrl]) => {
            console.log(`   ${path.basename(old)} -> ${newUrl}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Hata:', error);
        process.exit(1);
    }
}

uploadFilesToBlob();
