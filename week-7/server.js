require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes); // Public routes: register & login
app.use('/api/users', userRoutes); // Protected routes


// Connect to MongoDB and Start Server
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
