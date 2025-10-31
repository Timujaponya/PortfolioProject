// Vercel Serverless Function wrapper for Express backend
const app = require('../backend/app');
const { connectDb } = require('../backend/config/db');

// MongoDB bağlantısını kur
let isConnected = false;

async function connectToDatabase() {
    if (isConnected) {
        return;
    }
    
    await connectDb();
    isConnected = true;
}

// Serverless function handler
module.exports = async (req, res) => {
    await connectToDatabase();
    return app(req, res);
};
