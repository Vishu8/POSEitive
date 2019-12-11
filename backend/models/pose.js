const mongoose = require('mongoose');

const poseSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  nosexValue: {
    type: Number,
    required: true,
  },
  noseyValue: {
    type: Number,
    required: true,
  },
  leftEyexValue: {
    type: Number,
    required: true,
  },
  leftEyeyValue: {
    type: Number,
    required: true,
  },
  rightEyexValue: {
    type: Number,
    required: true,
  },
  rightEyeyValue: {
    type: Number,
    required: true,
  },
  leftShoulderxValue: {
    type: Number,
    required: true,
  },
  leftShoulderyValue: {
    type: Number,
    required: true,
  },
  rightShoulderxValue: {
    type: Number,
    required: true,
  },
  rightShoulderyValue: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Pose', poseSchema);
