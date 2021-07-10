const User = require('../models/User');
const { body, validationResult } = require('express-validator');

//GET /users
module.exports.user_list = (req, res, next) => {
  User.find().sort([['lastName', 'ascending']]).exec((err, users) => {
    if (err) { return res.json(err); };
    return res.json(users);
  });
};

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