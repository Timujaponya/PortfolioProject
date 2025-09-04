// app kurulumu ve kullanılacak middleware ve route benzeri belirtmeler burada yapılıyor



const express = require("express");
const { errorHandler } = require("./middleware/errorHandler");
const projectsRouter = require("./routes/projects.js");
const cors = require("cors");


const app = express();

app.use(cors({
    origin: ["http://localhost:5173", "portfolio sitesinin linki gelecek buraya"], // izin verilen originler
    credentials: true // cookie veya Authorization header göndermeye izin verir
}))
app.use(express.json()); // json middleware
app.use("/api/projects", projectsRouter); // projectRouter
app.use(errorHandler); // Error Handler middleware

module.exports = app;