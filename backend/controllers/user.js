const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      fullname: req.body.fullname,
      email: req.body.email,
      password: hash
    });
    user.save().then((result) => {
      return res.status(201).json({
        message: 'User Created Successfully!',
        userId: result._id
      });
    }).catch((err) => {
      return res.status(500).json({
        message: 'User Credentials already Exists!'
      });
    });
  });
};

exports.userLogin = (req, res, next) => {
  let fetchedUser;
  User.findOne({
    email: req.body.email
  }).then((user) => {
    if (!user) {
      return res.status(401).json({
        message: 'No such Email exists!'
      });
    }
    fetchedUser = user;
    return bcrypt.compare(req.body.password, user.password);
  }).then((result) => {
    if (!result) {
      return res.status(401).json({
        message: 'Wrong Password!'
      });
    }
    const token = jwt.sign({
      email: fetchedUser.email,
      userId: fetchedUser._id
    }, process.env.JWT_KEY, {
      algorithm: 'HS512',
      noTimestamp: true
    });
    return res.status(200).json({
      message: 'Logged In!',
      token: token,
      userId: fetchedUser._id,
      username: fetchedUser.fullname
    });
  }).catch((err) => {
    return res.status(401).json({
      message: 'Invalid Authentication Credentials!'
    });
  });
};
