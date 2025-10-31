// Vercel Serverless Function wrapper for Express backend
const app = require('../backend/app');
const { connectDb } = require('../backend/config/db');

// MongoDB bağlantısını kur (singleton pattern)
let isConnected = false;

async function connectToDatabase() {
    if (isConnected) {
        return;
    }
    
    try {
        await connectDb();
        isConnected = true;
        console.log('✅ MongoDB connected');
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error);
        throw error;
    }
}

// Serverless function handler
module.exports = async (req, res) => {
    try {
        await connectToDatabase();
        
        // Express app'i handler olarak kullan
        app(req, res);
    } catch (error) {
        console.error('Function error:', error);
        res.status(500).json({ 
            error: 'Internal server error', 
            message: error.message 
        });
    }
};
