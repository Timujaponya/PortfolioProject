// Migration script to update existing data to new icon format
const mongoose = require('mongoose');
require('dotenv').config();

const Profile = require('./models/Profile');
const Service = require('./models/Service');
const Project = require('./models/Project');

const migrateData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB bağlantısı başarılı');

    // Migrate Profile - techStack string[] -> object[]
    const profiles = await Profile.find({});
    for (const profile of profiles) {
      if (profile.techStack && profile.techStack.length > 0) {
        const firstTech = profile.techStack[0];
        
        // Eğer string array ise object array'e çevir
        if (typeof firstTech === 'string') {
          profile.techStack = profile.techStack.map(tech => ({
            name: tech,
            icon: 'faCode' // Default icon
          }));
          await profile.save();
          console.log(`✅ Profile techStack migrated: ${profile.name}`);
        }
      }
      
      // Social links için icon override fields ekle (boş olarak)
      if (!profile.socialLinks.githubIcon) {
        profile.socialLinks.githubIcon = '';
        profile.socialLinks.linkedinIcon = '';
        profile.socialLinks.twitterIcon = '';
        profile.socialLinks.websiteIcon = '';
        await profile.save();
        console.log(`✅ Profile social icon fields added: ${profile.name}`);
      }
    }

    // Migrate Services - features string[] -> object[]
    const services = await Service.find({});
    for (const service of services) {
      if (service.features && service.features.length > 0) {
        const firstFeature = service.features[0];
        
        // Eğer string array ise object array'e çevir
        if (typeof firstFeature === 'string') {
          service.features = service.features.map(feature => ({
            text: feature,
            icon: 'faCheck' // Default icon
          }));
          await service.save();
          console.log(`✅ Service features migrated: ${service.title}`);
        }
      }
      
      // Icon field'ı emoji ise FA icon'a çevir
      if (service.icon && !/^fa/.test(service.icon)) {
        service.icon = 'faLaptopCode'; // Default FA icon
        await service.save();
        console.log(`✅ Service icon updated: ${service.title}`);
      }
    }

    // Migrate Projects - icon ve categoryIcon fields ekle
    const projects = await Project.find({});
    for (const project of projects) {
      let updated = false;
      
      if (!project.icon) {
        project.icon = 'faLaptopCode';
        updated = true;
      }
      
      if (!project.categoryIcon) {
        // Kategori'ye göre default icon ata
        switch (project.category) {
          case 'web':
            project.categoryIcon = 'faGlobe';
            break;
          case 'game':
            project.categoryIcon = 'faGamepad';
            break;
          case 'tools':
            project.categoryIcon = 'faTools';
            break;
          default:
            project.categoryIcon = 'faCode';
        }
        updated = true;
      }
      
      if (updated) {
        await project.save();
        console.log(`✅ Project icons added: ${project.title}`);
      }
    }

    console.log('\n🎉 Migration tamamlandı!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration hatası:', error);
    process.exit(1);
  }
};

migrateData();
