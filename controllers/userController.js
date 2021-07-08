const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');

module.exports.user_list = (req, res, next) => {

};

module.exports.create_user = [

  body('firstName', 'You must enter a first name').trim().isLength({ min: 1 }).escape(),
  body('lastName', 'You must enter a last name').trim().isLength({ min: 1 }).escape(),
  body('email', 'You must enter an email').trim().isEmail().escape(),
  body('password', 'Password must be at least 6 chars').trim().isLength({min: 6}).escape(),
  
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {

      const errorMessages = [];
      errors.errors.forEach((msg) => {
        errorMessages.push(msg.msg);
      });

      return res.json({ 'message': errorMessages });
    };


    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      friends: []
    });

    user.save((err, user) => {
      if (err) {
        return res.json({ 'message': 'Email already exists' }); // Make sure this is right... might trigger for other errors too
      };
      req.logIn(user, { session: false }, function (err) {
        if (err) {
          console.log('login error', err)
          return next(err);
        };
        return res.json({ 'user': user });// maybe make token and save
      });
    });
  }
];

module.exports.user_details = (req, res, next) => {
  res.send('user details')
};

module.exports.edit_user_details = (req, res, next) => {

};

module.exports.delete_user = (req, res, next) => {

};