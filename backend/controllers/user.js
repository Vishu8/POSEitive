const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      fullname: req.body.fullname,
      email: req.body.email,
      password: hash
    });
    user.save().then((result) => {
      res.status(201).json({
        message: 'User Created Successfully!',
        userId: result._id
      });
    }).catch((err) => {
      res.status(500).json({
        message: 'User Credentials already Exists!'
      });
    });
  });
};
