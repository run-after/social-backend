const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const Post = require('../models/Post');
const FriendRequest = require('../models/FriendRequest');
const Like = require('../models/Like');
const Comment = require('../models/Comment');

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
  // Delete user from DB
  User.findByIdAndDelete(req.params.userID, (err, deletedUser) => {
    if (err) { return res.json({ 'message': ['User not found'] }); };
    // Iterate through each user on friend list and remove user from list
    deletedUser.friends.forEach(friendID => {
      User.findById(friendID).exec((err, user) => {
        if (err) { return res.json(err); };
        user.friends = user.friends.filter(friendID => friendID.toString() !== deletedUser._id.toString());
        user.save((err, user) => {
          if (err) { return res.json(err); };
        });
      });
    });
    // Remove all posts created by user
    Post.find({ 'author': req.params.userID }).exec((err, post_list) => {
      if (err) { return err.json(); };
      // Iterate through each post and...
      post_list.forEach(post => {
        // Delete likes
        Like.find({ 'post': post._id }).deleteMany().exec((err, data) => {
          if (err) { return err.json(); };
        });
        // Delete comments
        Comment.find({ 'post': post._id }).deleteMany().exec((err, data) => {
          if (err) { return err.json(); };
        });
        // Delete post
        Post.findByIdAndDelete(post._id).exec((err, data) => {
          if (err) { return err.json(); };
        });
      });
    });
    // Delete all comments made by user
    Comment.find({ 'author': req.params.userID }).exec((err, comment_list) => {
      if (err) { return err.json(); };
      // Iterate through comments made by user and...
      comment_list.forEach(comment => {
        // Delete likes
        Like.find({ 'comment': comment._id }).deleteMany().exec((err, data) => {
          if (err) { return err.json(); };
        });
        // Delete comments
        Comment.findByIdAndDelete(comment._id).exec((err, data) => {
          if (err) { return err.json(); };
        });
      });
    });
    // Delete all likes made by user
    Like.find({ 'user': req.params.userID }).deleteMany().exec((err, data) => {
      if (err) { return err.json(); };
    });
    // Delete all friend requests that user requested
    FriendRequest.find({ 'requester': req.params.userID }).deleteMany().exec((err, data) => {
      if (err) { return err.json(); };
    });
    // Delete all friend requests that user was requested
    FriendRequest.find({ 'requested': req.params.userID }).deleteMany().exec((err, data) => {
      if (err) { return err.json(); };
    });
    return res.json(deletedUser);
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