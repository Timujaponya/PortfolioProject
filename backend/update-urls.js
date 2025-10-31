// MongoDB'deki localhost URL'lerini production URL'lere güncelle
require('dotenv').config();
const mongoose = require('mongoose');
const Profile = require('./models/Profile');
const Project = require('./models/Project');

const BACKEND_URL = 'https://portfolioproject-gigt.onrender.com';

async function updateUrls() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB bağlantısı başarılı');

        // Profile URL'lerini güncelle
        const profile = await Profile.findOne();
        if (profile) {
            if (profile.avatarUrl) {
                profile.avatarUrl = profile.avatarUrl.replace(/http:\/\/localhost:\d+/, BACKEND_URL);
            }
            if (profile.cvUrl) {
                profile.cvUrl = profile.cvUrl.replace(/http:\/\/localhost:\d+/, BACKEND_URL);
            }
            
            // Tech stack iconlarını güncelle
            if (profile.techStack) {
                profile.techStack.forEach(tech => {
                    if (tech.icon && tech.icon.startsWith('custom:http://localhost')) {
                        tech.icon = tech.icon.replace(/http:\/\/localhost:\d+/, BACKEND_URL);
                    }
                });
            }
            
            await profile.save();
            console.log('✅ Profile URL\'leri güncellendi');
        }

        // Project URL'lerini güncelle
        const projects = await Project.find();
        for (const project of projects) {
            if (project.imageUrl) {
                project.imageUrl = project.imageUrl.replace(/http:\/\/localhost:\d+/, BACKEND_URL);
            }
            await project.save();
        }
        console.log(`✅ ${projects.length} proje URL'leri güncellendi`);

        console.log('\n🎉 Tüm URL\'ler başarıyla güncellendi!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Hata:', error);
        process.exit(1);
    }
}

updateUrls();
