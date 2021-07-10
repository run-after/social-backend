const Comment = require('../models/Comment');
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
module.exports.edit_comment = (req, res, next) => {

};

//DELETE /posts/:postID/comments/:commentID
module.exports.delete_comment = (req, res, next) => {

};

//GET /posts/:postID/comments/:commentID/likes
module.exports.get_likes = (req, res, next) => {

};

//PUT /posts/:postID/comments/:commentID/likes
module.exports.like_comment = (req, res, next) => {

};