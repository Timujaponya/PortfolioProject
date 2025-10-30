// Veritabanındaki tüm verileri temizle

const mongoose = require("mongoose");
const { connectDb } = require("./config/db");
const Profile = require("./models/Profile");
const Project = require("./models/Project");
const Service = require("./models/Service");

const clearDatabase = async () => {
    try {
        await connectDb();
        
        console.log("🗑️  Veritabanı temizleniyor...");
        await Profile.deleteMany({});
        await Project.deleteMany({});
        await Service.deleteMany({});

        console.log("✅ Veritabanı başarıyla temizlendi!");
        console.log("💡 Admin panelden yeni veriler ekleyebilirsiniz.");
        
        process.exit(0);
    } catch (err) {
        console.error("❌ Veritabanı temizleme hatası:", err);
        process.exit(1);
    }
};

clearDatabase();
