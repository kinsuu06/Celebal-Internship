require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const axios = require('axios');

// Route Modules
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

// Models (for file and weather metadata)
const File = require('./models/File');
const WeatherQuery = require('./models/WeatherQuery');

// Middleware
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(express.json());
app.use('/uploads', express.static('uploads')); // serve uploaded files

// ---------- 1. File Upload Setup ----------
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// File Upload Route
app.post('/api/upload', upload.single('file'), async (req, res, next) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        const file = new File({
            filename: req.file.filename,
            path: req.file.path
        });

        await file.save();

        res.status(200).json({ message: 'File uploaded successfully', file });
    } catch (err) {
        next(err);
    }
});

// ---------- 2. Weather API Integration ----------
app.get('/api/weather/:city', async (req, res, next) => {
    const city = req.params.city;
    const apiKey = process.env.WEATHER_API_KEY;

    try {
        const response = await axios.get(
            `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );

        const data = response.data;

        const weatherRecord = new WeatherQuery({
            city: data.name,
            temperature: data.main.temp,
            description: data.weather[0].description
        });

        await weatherRecord.save();

        res.json({
            city: data.name,
            temperature: data.main.temp,
            condition: data.weather[0].description
        });
    } catch (error) {
        next(error);
    }
});

// ---------- 3. Routes ----------
app.use('/api/auth', authRoutes); // Public: register & login
app.use('/api/users', userRoutes); // Protected routes

// ---------- 4. Centralized Error Handler ----------
app.use(errorHandler);

// ---------- 5. Connect to MongoDB and Start Server ----------
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/jwt_auth_example', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
})
.catch(err => {
    console.error("MongoDB connection error:", err);
});
