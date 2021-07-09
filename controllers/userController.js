const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

//GET /users
module.exports.user_list = (req, res, next) => {
  User.find().sort([['lastName', 'ascending']]).exec((err, users) => {
    if (err) { return res.json(err); };
    return res.json(users);
  });
};

//POST /users
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
        return res.json({ 'message': 'Email already exists' });
      };
      req.logIn(user, { session: false }, function (err) {
        if (err) { return next(err); };
          const token = jwt.sign({user}, process.env.SECRET);
          return res.json({ user, token });
      });
    });
  }
];

//GET /users/:userID
module.exports.user_details = (req, res, next) => {
  User.findById(req.params.userID).exec((err, user) => {
    if (err) { return res.json({'message': 'User not found'}); };
    return res.json(user);  
  });
};

//PUT /users/:userID
module.exports.edit_user_details = [
  
  body('firstName', 'You must enter a first name').trim().isLength({ min: 1 }).escape(),
  body('lastName', 'You  must enter a last name').trim().isLength({ min: 1 }).escape(),
  
  (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {

      const errorMessages = [];
      errors.errors.forEach((msg) => {
        errorMessages.push(msg.msg);
      });

      return res.json({ 'message': errorMessages });
    };

    const user = User.findById(req.params.userID).exec((err, user) => {
      if (err) { return res.json(err); };
      user.firstName = req.body.firstName;
      user.lastName = req.body.lastName;
      user.save((err, user) => {
        if (err) { return res.json(err); };
        return res.json(user);
      });
    });
  }
];

//DELETE /users/:userID
module.exports.delete_user = (req, res, next) => {
  User.findByIdAndDelete(req.params.userID, (err, docs) => {
    if (err) { return res.json({'message': 'User not found'}); };
    // delete posts and comments and likes and friend requests
    return res.json(docs)
  });
};