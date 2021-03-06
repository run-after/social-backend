const Post = require('../models/Post');
const Like = require('../models/Like');
const Comment = require('../models/Comment');
const { body, validationResult } = require('express-validator');
const aws = require('aws-sdk');
const AmazonS3URI = require('amazon-s3-uri');

//GET /posts
module.exports.post_list = (req, res, next) => {
  Post.find().populate('author').sort([['createdAt', 'descending']]).exec((err, post_list) => {
    if (err) { return res.json(err); };
    return res.json(post_list);
  });
};

//POST /posts
module.exports.create_post = [

  body('content', 'You must include the content of the post').trim().isLength({ min: 1 }),
  
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMessages = [];
      errors.errors.forEach((msg) => {
        errorMessages.push(msg.msg);
      });

      return res.json({ 'message': errorMessages });
    };

    const post = new Post({
      content: req.body.content,
      author: req.user._id,
      isPicture: req.body.isPicture
    });

    post.save((err, post) => {
      if (err) { return res.json(err); };
      return res.json(post);
    });
  }
];

//GET /posts/:postID
module.exports.post_detail = (req, res, next) => {
  Post.findById(req.params.postID).exec((err, post) => {
    if (err) { return res.json({ 'message': ['Post not found'] }); };
    return res.json(post);
  });
};

//PUT /posts/:postID
module.exports.edit_post = [

  body('content', 'You must include the content of the post').trim().isLength({ min: 1 }),
  
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMessages = [];
      errors.errors.forEach((msg) => {
        errorMessages.push(msg.msg);
      });

      return res.json({ 'message': errorMessages });
    };    

    Post.findById(req.params.postID, (err, post) => {
      if (err) { return res.json({ 'message': ['Post does not exist'] }); };
      post.content = req.body.content;

      post.save((err, post) => {
        if (err) { return res.json(err); };
        return res.json(post);
      });
    });
  }
];

//DELETE /posts/:postID
module.exports.delete_post = (req, res, next) => {
  Post.findByIdAndDelete(req.params.postID, (err, post) => {
    if (err || !post) { return res.json({ 'message': ['Post not found'] }); };
    
    // If image post, delete from DB
    if (post.isPicture) {
      const s3 = new aws.S3();
      const { key } = AmazonS3URI(post.content);
      s3.deleteObject({
        Bucket: process.env.AWS_BUCKET,
        Key: key
      }, function (err, data) {
        if (err) { return res.json(err); };
      });
    };

    // Delete all associated comments
    Comment.find({ 'post': req.params.postID }).exec((err, comment_list) => {
      if (err) { return res.json(err); };
      // iterate through each comment
      comment_list.forEach((comment) => {
        //remove comment
        Comment.findByIdAndDelete(comment._id).exec((err) => {
          if (err) { return res.json(err); };
        });
        // remove comment's likes
        Like.find({ 'comment': comment._id }).remove().exec((err, like) => {
          if (err) { return res.json(err); };
        });
      });
    });
    // Delete all associated likes
    Like.find({ 'post': req.params.postID }).remove().exec((err, data) => {
      if (err) { return res.json(err); };
    });
    return res.json(post);
  });
};

//GET /posts/:postID/likes
module.exports.get_likes = (req, res, next) => {
  Like.find({ post: req.params.postID }).exec((err, like_list) => {
    if (err) { return res.json({ 'message': ['Post not found'] }); };
    return res.json(like_list);
  });
};

//POST /posts/:postID/likes
module.exports.like_post = (req, res, next) => {
  const like = new Like({
    post: req.params.postID,
    user: req.user
  });

  like.save((err, like) => {
    if (err) { return res.json({ 'message': ['Post not found'] }); };
    return res.json(like);
  });
};

module.exports.unlike_post = (req, res, next) => {
  Like.find({ 'user': req.user, 'post': req.params.postID }).deleteOne().exec((err, like) => {
    if (err) { return res.json(err); };
    return res.json(like);
  });
};