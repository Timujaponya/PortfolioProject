// Veritabanına örnek veri eklemek için kullanılır

const mongoose = require("mongoose");
const { connectDb } = require("./config/db");
const Profile = require("./models/Profile");
const Project = require("./models/Project");
const Service = require("./models/Service");

const seedData = async () => {
    try {
        await connectDb();
        
        console.log("🗑️  Mevcut veriler temizleniyor...");
        await Profile.deleteMany({});
        await Project.deleteMany({});
        await Service.deleteMany({});

        console.log("👤 Profil oluşturuluyor...");
        const profile = await Profile.create({
            name: "Timuçin",
            title: "Software Developer & Future Game Creator",
            bio: "Experienced software developer specializing in web development and game creation. Passionate about building innovative solutions and creating engaging user experiences.",
            email: "timucin@example.com",
            phone: "+90 555 123 4567",
            location: "Turkey",
            avatarUrl: "https://via.placeholder.com/200",
            cvUrl: "https://example.com/cv.pdf",
            socialLinks: {
                github: "https://github.com/Timujaponya",
                linkedin: "https://linkedin.com/in/timucin",
                twitter: "https://twitter.com/timucin",
                website: "https://timucin.dev"
            },
            techStack: ["JavaScript", "TypeScript", "React", "Node.js", "MongoDB", "Unity"]
        });

        console.log("📁 Projeler oluşturuluyor...");
        const projects = await Project.insertMany([
            {
                title: "E-Commerce Platform",
                description: "Full-stack e-commerce solution with React and Node.js",
                tags: ["React", "Node.js", "MongoDB", "Express"],
                category: "web",
                link: "https://example-ecommerce.com",
                githubUrl: "https://github.com/timucin/ecommerce",
                imageUrl: "https://via.placeholder.com/400x300",
                order: 1,
                isActive: true
            },
            {
                title: "2D Platformer Game",
                description: "Retro-style platformer game built with Unity",
                tags: ["Unity", "C#", "Game Development"],
                category: "game",
                link: "https://example-game.com",
                githubUrl: "https://github.com/timucin/platformer",
                imageUrl: "https://via.placeholder.com/400x300",
                order: 3,
                isActive: true
            },
            {
                title: "Task Management Tool",
                description: "Collaborative task management application",
                tags: ["React", "Redux", "Node.js"],
                category: "tools",
                link: "https://example-tasks.com",
                githubUrl: "https://github.com/timucin/task-manager",
                imageUrl: "https://via.placeholder.com/400x300",
                order: 4,
                isActive: true
            }
        ]);

        console.log("💼 Servisler oluşturuluyor...");
        const services = await Service.insertMany([
            {
                title: "Web Development",
                description: "Modern, responsive web applications built with latest technologies",
                icon: "💻",
                price: {
                    min: 1000,
                    max: 5000,
                    currency: "USD"
                },
                features: [
                    "Responsive Design",
                    "SEO Optimization",
                    "Performance Optimization",
                    "Cross-browser Compatibility"
                ],
                order: 1,
                isActive: true
            },
            {
                title: "Game Prototyping",
                description: "Rapid game prototyping and development services",
                icon: "🎮",
                price: {
                    min: 2000,
                    max: 8000,
                    currency: "USD"
                },
                features: [
                    "2D/3D Game Development",
                    "Unity & Unreal Engine",
                    "Gameplay Mechanics",
                    "Prototype to Production"
                ],
                order: 2,
                isActive: true
            },
            {
                title: "UI/UX Design",
                description: "Beautiful and intuitive user interface design",
                icon: "🎨",
                price: {
                    min: 500,
                    max: 3000,
                    currency: "USD"
                },
                features: [
                    "User Research",
                    "Wireframing",
                    "Interactive Prototypes",
                    "Design Systems"
                ],
                order: 3,
                isActive: true
            }
        ]);

        console.log("✅ Seed data başarıyla oluşturuldu!");
        console.log(`   - ${profile ? 1 : 0} Profil`);
        console.log(`   - ${projects.length} Proje`);
        console.log(`   - ${services.length} Servis`);
        
        process.exit(0);
    } catch (err) {
        console.error("❌ Seed data hatası:", err);
        process.exit(1);
    }
};

seedData();
