// mongoose ile veritabanı bağlantısı buradan.

const mongoose = require("mongoose");
const {mongoUri} = require("./env.js");

async function connectDb(){
    try{
        await mongoose.connect(mongoUri);
        console.log("MongoDB connected with Mongoose");
    } catch(err){
        console.error("DB connection error", err);
        process.exit(1);
    }
}


module.exports = {connectDb};
