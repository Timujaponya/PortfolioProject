// MongoDB'deki URL'leri Vercel Blob URL'lere güncelle
require('dotenv').config();
const mongoose = require('mongoose');
const Profile = require('./models/Profile');
const Project = require('./models/Project');

const OLD_URLS = [
    'http://localhost:3000/uploads/',
    'https://portfolioproject-gigt.onrender.com/uploads/'
];

const BLOB_BASE = 'https://iibm49vfctop4abm.public.blob.vercel-storage.com/';

async function updateDatabaseUrls() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB bağlantısı başarılı\n');

        // Profile güncelle
        const profile = await Profile.findOne();
        if (profile) {
            let updated = false;

            // Avatar URL
            if (profile.avatarUrl) {
                for (const oldUrl of OLD_URLS) {
                    if (profile.avatarUrl.includes(oldUrl)) {
                        const filename = profile.avatarUrl.split('/').pop();
                        profile.avatarUrl = BLOB_BASE + filename;
                        updated = true;
                        console.log(`✅ Avatar: ${filename}`);
                    }
                }
            }

            // CV URL
            if (profile.cvUrl) {
                for (const oldUrl of OLD_URLS) {
                    if (profile.cvUrl.includes(oldUrl)) {
                        const filename = profile.cvUrl.split('/').pop();
                        profile.cvUrl = BLOB_BASE + filename;
                        updated = true;
                        console.log(`✅ CV: ${filename}`);
                    }
                }
            }

            // Tech stack icons
            if (profile.techStack) {
                profile.techStack.forEach(tech => {
                    if (tech.icon && tech.icon.startsWith('custom:')) {
                        const iconUrl = tech.icon.replace('custom:', '');
                        for (const oldUrl of OLD_URLS) {
                            if (iconUrl.includes(oldUrl)) {
                                const filename = iconUrl.split('/').pop();
                                tech.icon = `custom:${BLOB_BASE}${filename}`;
                                updated = true;
                                console.log(`✅ Icon: ${filename}`);
                            }
                        }
                    }
                });
            }

            if (updated) {
                await profile.save();
                console.log('\n✅ Profile güncellendi');
            }
        }

        // Projects güncelle
        const projects = await Project.find();
        let projectCount = 0;
        for (const project of projects) {
            if (project.imageUrl) {
                for (const oldUrl of OLD_URLS) {
                    if (project.imageUrl.includes(oldUrl)) {
                        const filename = project.imageUrl.split('/').pop();
                        project.imageUrl = BLOB_BASE + filename;
                        await project.save();
                        projectCount++;
                        console.log(`✅ Project: ${filename}`);
                    }
                }
            }
        }
        
        if (projectCount > 0) {
            console.log(`\n✅ ${projectCount} proje güncellendi`);
        }

        console.log('\n🎉 Tüm URL\'ler güncellendi!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Hata:', error);
        process.exit(1);
    }
}

updateDatabaseUrls();
