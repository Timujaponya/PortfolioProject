// sunucu ve bağlantı ayarları ve sunucunun başlatılması buradan


const { connectDb } = require("./config/db.js"); // MongoDB bağlantısı
const app = require("./app.js");

const {port} = require("./config/env.js");

// Async startServer ile DB bağlanıp server başlat
async function startServer() {
    try {
        await connectDb();
        app.listen(port, ()=>{
            console.log(`server running on ${port}`);
        })
    } catch (err) {
        console.error("DB bağlantı hatası:", err);
    }
}

// server’ı başlat
startServer();
