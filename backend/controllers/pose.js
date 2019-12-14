const Pose = require('../models/pose');

exports.savePose = (req, res, next) => {
  const pose = new Pose({
    userId: req.body.userId,
    nosexValue: req.body.nosexValue,
    noseyValue: req.body.noseyValue,
    leftEyexValue: req.body.leftEyexValue,
    leftEyeyValue: req.body.leftEyeyValue,
    rightEyexValue: req.body.rightEyexValue,
    rightEyeyValue: req.body.rightEyeyValue,
    leftShoulderxValue: req.body.leftShoulderxValue,
    leftShoulderyValue: req.body.leftShoulderyValue,
    rightShoulderxValue: req.body.rightShoulderxValue,
    rightShoulderyValue: req.body.rightShoulderyValue
  });
  pose.save().then((savedPose) => {
    res.status(201).json({
      message: 'Pose Added Successfully!'
    });
  }).catch((error) => {
    res.status(500).json({
      message: 'Failed to add Pose!'
    });
  });
};

exports.checkPose = (req, res, next) => {
  Pose.findOne({
    userId: req.params.userId
  }).then((isPose) => {
    if (!isPose) {
      return res.status(401).json({
        message: 'No such UserId!',
        status: 401
      });
    }
    return res.status(201).json({
      message: 'UserId Found!',
      status: 201
    });
  }).catch((err) => {
    return res.status(401).json({
      message: 'No such Entry!'
    });
  });
};
