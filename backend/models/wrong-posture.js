const mongoose = require('mongoose');

const wrongPostureSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  sessionId: {
    type: String,
    required: true
  },
  wrongCount: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('WrongPosture', wrongPostureSchema);
