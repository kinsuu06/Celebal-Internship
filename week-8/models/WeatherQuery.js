const mongoose = require('mongoose');

const weatherQuerySchema = new mongoose.Schema({
  city: String,
  temperature: Number,
  description: String,
  searchedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('WeatherQuery', weatherQuerySchema);
