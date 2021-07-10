const Post = require('../models/Post');

//GET /posts
module.exports.post_list = (req, res, next) => {
  Post.find().exec((err, post_list) => {
    if (err) { return res.json(err); };
    return res.json(post_list);
  });
};

//POST /posts
module.exports.create_post = (req, res, next) => {

};

//GET /posts/:postID
module.exports.post_detail = (req, res, next) => {

};

//PUT /posts/:postID
module.exports.edit_post = (req, res, next) => {

};

//DELETE /posts/:postID
module.exports.delete_post = (req, res, next) => {

};

//PUT /posts/:postID/like
module.exports.like_post = (req, res, next) => {

};