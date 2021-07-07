const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');

module.exports.home = (req, res, next) => {
  res.send('hi')
};

module.exports.log_in = (req, res, next) => {
  passport.authenticate('local', {session: false}, function (err, user, info) {
    if (err) { return next(err); };
    if (!user) { return res.json(info); };
    req.logIn(user, {session: false},function (err) {
      if (err) { return next(err); };
      return res.json({ 'message': 'logged in' });// maybe make token and save
    });
  })(req, res, next);
};

module.exports.sign_up = (req, res, next) => {
  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    friends: []
  });

  user.save((err, user) => {
    if (err) {
      return res.json(err.errors)
    }
    if (err) { return next(err); };
    console.log('user saved');
    res.redirect('/');
  });
};