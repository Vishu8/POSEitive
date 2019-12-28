const Pose = require('../models/pose');
const Session = require('../models/session');

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
    return res.status(201).json({
      message: 'Pose Added Successfully!'
    });
  }).catch((error) => {
    return res.status(500).json({
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
        message: 'Your Pose is not Recorded!',
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

exports.saveSession = (req, res, next) => {
  const session = new Session({
    userId: req.body.userId,
    date: req.body.date,
    startTime: req.body.startTime,
    sessionTime: req.body.sessionTime
  });
  session.save().then((savedSession) => {
    return res.status(201).json({
      message: 'Session Added Successfully!'
    });
  }).catch((err) => {
    return res.status(500).json({
      message: 'Failed to Start Session!'
    });
  });
};

exports.updateSession = async (req, res, next) => {
  Session.update({
    _id: req.params.sessionId
  }, {
    sessionTime: req.params.time
  }).then((result) => {
    return res.status(201).json({
      message: 'Time Updated!'
    });
  }).catch((error) => {
    return res.status(500).json({
      message: 'Time Updating Failed!'
    });
  });
};

exports.getSessionDetails = async (req, res, next) => {
  Session.findOne({
    userId: req.params.userId,
    startTime: req.params.time
  }).then((result) => {
    return res.status(201).json({
      id: result._id,
      message: 'Session Id Found!'
    });
  }).catch((err) => {
    return res.status(500).json({
      id: null,
      message: 'Session Id Not Found!'
    });
  });
};
