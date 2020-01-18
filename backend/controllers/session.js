const Session = require('../models/session');

exports.getSession = (req, res, next) => {
  Session.find({
    userId: req.params.userId
  }).then((result) => {
    return res.status(201).json({
      result,
      message: 'Session Log Found!'
    });
  }).catch((err) => {
    return res.status(500).json({
      message: 'Session Log Not Found!'
    });
  });
};
