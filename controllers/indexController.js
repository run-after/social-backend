const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

module.exports.home = (req, res, next) => {
  res.send('hi')
};

module.exports.log_in = (req, res, next) => {
  passport.authenticate('local', {session: false}, function (err, user, info) {
    if (err) { return next(err); };
    if (!user) { return res.json(info); };
    req.logIn(user, {session: false}, function (err) {
      if (err) { return next(err); };
      const token = jwt.sign({user}, process.env.SECRET);
      return res.json({ user, token });
    });
  })(req, res, next);
};