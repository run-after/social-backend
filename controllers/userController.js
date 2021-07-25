const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const Post = require('../models/Post');
const FriendRequest = require('../models/FriendRequest');

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
      user.friends = req.body.friends;
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
    if (err) { return res.json({'message': ['User not found']}); };
    // delete posts and comments and likes and friend requests////////
    return res.json(docs)
  });
};

//GET /users/:userID/posts
module.exports.get_user_posts = (req, res, next) => {
  Post.find({ 'author': req.params.userID }).populate('author').sort([['createdAt', 'descending']]).exec((err, post_list) => {
    if (err) { return res.json(err); };
    return res.json(post_list);
  });
};

//GET /users/:userID/comments
module.exports.get_user_comments = (req, res, next) => {
  Post.find({ 'author': req.params.userID }).exec((err, comment_list) => {
    if (err) { return res.json(err); };
    return res.json(comment_list);
  });
};

module.exports.get_friend_requests = (req, res, next) => {
  const data = { 'requested': [], 'requester': [] };
  FriendRequest.find({ 'requested': req.user }).exec((err, requested_list) => {
    if (err) { return res.json(err); };
    data.requested = requested_list;
    FriendRequest.find({ 'requester': req.user }).exec((err, requester_list) => {
      if (err) { return res.json(err); };
      data.requester = requester_list;
      return res.json(data);
    });
  });
};