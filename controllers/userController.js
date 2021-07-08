const User = require('../models/User');
const bcrypt = require('bcryptjs');

module.exports.user_list = (req, res, next) => {

};

module.exports.create_user = (req, res, next) => {
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
    req.logIn(user, { session: false }, function (err) {
      if (err) { return next(err); };
      return res.json({ 'user': user });// maybe make token and save
    });
  });
};

module.exports.user_details = (req, res, next) => {

};

module.exports.edit_user_details = (req, res, next) => {

};

module.exports.delete_user = (req, res, next) => {

};