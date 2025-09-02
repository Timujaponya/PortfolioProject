require('dotenv').config();
const express = require("express");
const { connectDb } = require("./db.js"); // MongoDB bağlantısı
const projectsRouter = require("./routes/projects.js");
const { default: mongoose } = require('mongoose');


const app = express();
const port = process.env.PORT || 3000;


app.use(express.json()); // json middleware
app.use("/api/projects", projectsRouter); // api/projects/router dahil etme


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
