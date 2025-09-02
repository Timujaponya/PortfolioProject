const mongoose = require("mongoose");

async function connectDb(){
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected with Mongoose");
    } catch(err){
        console.error("DB connection error", err);
        process.exit(1);
    }
}


module.exports = {connectDb};





// const {MongoClient} = require("mongodb");
// require("dotenv").config();
// const uri = process.env.MONGODB_URI;
// const client = new MongoClient(uri);

// async function connectDb(){
//     await client.connect();
//     console.log("MongoDb connected");
//     return client.db("Portfolio");
// }

// module.exports = { connectDb };