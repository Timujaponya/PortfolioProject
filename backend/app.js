// app kurulumu ve kullanılacak middleware ve route benzeri belirtmeler burada yapılıyor

const express = require("express");
const path = require("path");
const { errorHandler } = require("./middleware/errorHandler");
const projectsRouter = require("./routes/projects.js");
const profileRouter = require("./routes/profile.js");
const servicesRouter = require("./routes/services.js");
const uploadRouter = require("./routes/upload.js");
const cors = require("cors");


const app = express();

app.use(cors({
    origin: [
        "http://localhost:5173", 
        "http://localhost:5174", 
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "portfolio sitesinin linki gelecek buraya"
    ], // izin verilen originler
    credentials: true // cookie veya Authorization header göndermeye izin verir
}))
app.use(express.json()); // json middleware

// Static files - Yüklenen resimleri serve et
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api/projects", projectsRouter); // projectRouter
app.use("/api/profile", profileRouter); // profileRouter
app.use("/api/services", servicesRouter); // servicesRouter
app.use("/api/upload", uploadRouter); // uploadRouter
app.use(errorHandler); // Error Handler middleware

module.exports = app;