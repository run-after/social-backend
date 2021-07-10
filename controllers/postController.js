const Post = require('../models/Post');
const { body, validationResult } = require('express-validator');

//GET /posts
module.exports.post_list = (req, res, next) => {
  Post.find().exec((err, post_list) => {
    if (err) { return res.json(err); };
    return res.json(post_list);
  });
};

//POST /posts
module.exports.create_post = [

  body('content', 'You must include the content of the post').trim().isLength({ min: 1 }).escape(),
  
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return req.json({'message': errors})
    };

    const post = new Post({
      content: req.body.content,
      author: req.user._id
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
    if (err) { return res.json({ 'message': 'Post not found' }); };
    return res.json(post);
  });
};

//PUT /posts/:postID
module.exports.edit_post = (req, res, next) => {
  Post.findById(req.params.postID, (err, post) => {
    if (err) { return res.json({ 'message': 'Post does not exist' }); };
    post.content = req.body.content;

    post.save((err, post) => {
      if (err) { return res.json(err); };
      return res.json(post);
    });
  });
};

//DELETE /posts/:postID
module.exports.delete_post = (req, res, next) => {

};

//PUT /posts/:postID/like
module.exports.like_post = (req, res, next) => {

};