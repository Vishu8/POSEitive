const Pose = require('../models/pose');
const Session = require('../models/session');
const WrongPosture = require('../models/wrong-posture');

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
  }).catch((err) => {
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

exports.updateSession = (req, res, next) => {
  Session.updateOne({
    _id: req.params.sessionId
  }, {
    sessionTime: req.params.time
  }).then((result) => {
    return res.status(201).json({
      message: 'Time Updated!'
    });
  }).catch((err) => {
    return res.status(500).json({
      message: 'Time Updating Failed!'
    });
  });
};

exports.getSessionDetails = (req, res, next) => {
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

exports.getUserCoordinates = (req, res, next) => {
  Pose.findOne({
    userId: req.params.userId,
  }).then((result) => {
    return res.status(201).json({
      result: result,
      message: 'Pose Coordinates Found!'
    });
  }).catch((err) => {
    return res.status(500).json({
      result: err,
      message: 'Pose Coordinates Not Found!'
    });
  });
};

exports.sendWrongPosture = (req, res, next) => {
  const sendWrongPosture = new WrongPosture({
    userId: req.body.userId,
    sessionId: req.body.sessionId,
    wrongCount: req.body.wrongCount
  });
  console.log(sendWrongPosture);
  sendWrongPosture.save().then(() => {
    return res.status(201).json({
      message: 'Wrong Posture Sent!'
    });
  }).catch((err) => {
    return res.status(500).json({
      message: 'Failed to add Wrong Posture!'
    });
  });
};

exports.updateWrongPosture = (req, res, next) => {
  WrongPosture.updateOne({
    sessionId: req.params.sessionId
  }, {
    wrongCount: req.params.wrongCount
  }).then((result) => {
    return res.status(201).json({
      message: 'Wrong Posture Updated!'
    });
  }).catch((err) => {
    return res.status(500).json({
      message: 'Wrong Posture Updating Failed!'
    });
  });
};
