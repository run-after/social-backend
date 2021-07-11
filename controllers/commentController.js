const Comment = require('../models/Comment');
const Like = require('../models/Like');
const { body, validationResult } = require('express-validator');

//GET /posts/:postID/comments
module.exports.comment_list = (req, res, next) => {
  Comment.find({'post': req.params.postID}).exec((err, comment_list) => {
    if (err) { return res.json(err); };
    return res.json(comment_list);
  });
};

//POST /posts/:postID/comments
module.exports.create_comment = [

  body('content', 'You must include comment content').trim().isLength({ min: 1 }).escape(),
  
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMessages = [];
      errors.errors.forEach((msg) => {
        errorMessages.push(msg.msg);
      });

      return res.json({ 'message': errorMessages });
    };

    const comment = new Comment({
      content: req.body.content,
      author: req.user._id,
      post: req.params.postID
    });

    comment.save((err, comment) => {
      if (err) { return res.json({ 'message': 'Post not found' }); };
      return res.json(comment);
    });
  }
];

//GET /posts/:postID/comments/:commentID
module.exports.comment_detail = (req, res, next) => {
  Comment.findById(req.params.commentID).exec((err, comment) => {
    if (err) { return res.json({ 'message': 'Comment not found' }); };
    return res.json(comment);
  });
};

//PUT /posts/:postID/comments/:commentID
module.exports.edit_comment = [

  body('content', 'You must include the content of the comment').trim().isLength({ min: 1 }).escape(),
  
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMessages = [];
      errors.errors.forEach((msg) => {
        errorMessages.push(msg.msg);
      });

      return res.json({ 'message': errorMessages });
    };    

    Comment.findById(req.params.commentID, (err, comment) => {
      if (err) { return res.json({ 'message': 'Comment does not exist' }); };
      comment.content = req.body.content;

      comment.save((err, post) => {
        if (err) { return res.json(err); };
        return res.json(comment);
      });
    });
  }
];

//DELETE /posts/:postID/comments/:commentID
module.exports.delete_comment = (req, res, next) => {
  Comment.findByIdAndDelete(req.params.commentID, (err, comment) => {
    if (err || !comment) { return res.json({ 'message': 'Comment not found' }); };
    Like.find({ 'comment': comment._id }).remove().exec((err) => {
      if (err) { return res.json(err); };
    });
    return res.json(comment);
  });
};

//GET /posts/:postID/comments/:commentID/likes
module.exports.get_likes = (req, res, next) => {
  Like.find({ comment: req.params.commentID }).exec((err, like_list) => {
    if (err) { return res.json({ 'message': 'Comment not found' }); };
    return res.json(like_list);
  });
};

//PUT /posts/:postID/comments/:commentID/likes
module.exports.like_comment = (req, res, next) => {
  const like = new Like({
    comment: req.params.commentID,
    user: req.user
  });

  like.save((err, like) => {
    if (err) { return res.json({ 'message': 'Comment not found' }); };
    return res.json(like);
  });
};

module.exports.unlike_comment = (req, res, next) => {
  Like.find({ 'user': req.user, 'comment': req.params.commentID }).deleteOne().exec((err, like) => {
    if (err) { return res.json(err); };
    return res.json(like);
  });
};