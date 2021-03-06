const passport = require('passport');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

module.exports.home = (req, res, next) => {
  res.send('hi')
};

module.exports.log_in = (req, res, next) => {
  passport.authenticate('local', {session: false}, function (err, user, info) {
    if (err) { return next(err); };
    if (!user) { return res.json(info); };
    req.logIn(user, {session: false}, function (err) {
      if (err) { return next(err); };
      const token = jwt.sign({user}, process.env.SECRET, {expiresIn: '1d'});
      return res.json({ user, token });
    });
  })(req, res, next);
};

module.exports.facebook_log_in = (req, res, next) => {
  User.find({ facebookID: req.body.userID }).exec((err, user) => {
    if (err) { return res.json(err); };
    if (user.length > 0) {
      user = user[0];
      req.logIn(user, { session: false }, function (err) {
        if (err) { return next(err); };
          const token = jwt.sign({user}, process.env.SECRET, {expiresIn: '1d'});
          return res.json({ user, token });
      });
    } else {
      const user = new User({
        firstName: req.body.name.split(' ')[0],
        lastName: req.body.name.split(' ')[1],
        email: `${req.body.id}@facebook.com`,
        password: bcrypt.hashSync(req.body.id, 8),
        friends: [],
        isFacebookLogin: true,
        facebookID: req.body.id,
        avatar: 'https://social-bucket.s3.us-east-2.amazonaws.com/anon.png'
      });
      user.save((err, user) => {
        if (err) {return res.json(err);};
        req.logIn(user, { session: false }, function (err) {
          if (err) { return next(err); };
          const token = jwt.sign({ user }, process.env.SECRET, { expiresIn: '1d' });
          return res.json({ user, token });
        });
      });
    };
  });
};

//POST /users
module.exports.create_user = [

  body('firstName', 'You must enter a first name').trim().isLength({ min: 1 }).escape(),
  body('lastName', 'You must enter a last name').trim().isLength({ min: 1 }).escape(),
  body('email', 'You must enter an email').trim().isEmail().escape(),
  body('password', 'Password must be at least 6 chars').trim().isLength({ min: 6 }).escape(),
  body('confirmation').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Password confirmation does not match password');
    };
    return true;
  }),
  
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
        return res.json({ 'message': ['Email already exists'] });
      };
      req.logIn(user, { session: false }, function (err) {
        if (err) { return next(err); };
          const token = jwt.sign({user}, process.env.SECRET, {expiresIn: '1d'});
          return res.json({ user, token });
      });
    });
  }
];