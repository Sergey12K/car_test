const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  VIN: {
    type: String,
    required: true,
    unique: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
});


const CarModel = mongoose.model('CarSchema', carSchema);


module.exports = { CarModel };