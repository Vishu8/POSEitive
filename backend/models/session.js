const mongoose = require('mongoose');

const sessionSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  sessionTime: {
    type: String,
    required: true
  },
  wrongCount: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Session', sessionSchema);
