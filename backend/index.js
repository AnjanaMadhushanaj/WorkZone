require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Basic Route
app.get('/', (req, res) => {
    res.send('🚀 WorkZone Backend is Running on Render!');
});

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB Connected Successfully!');
        // Server Start (Listen) - Render එකට මේක අනිවාර්යයි
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => console.error('❌ MongoDB Connection Error:', err));