const Comment = require('../models/Comment');

//GET /posts/:postID/comments
module.exports.comment_list = (req, res, next) => {
  Comment.find({'post': req.params.postID}).exec((err, comment_list) => {
    if (err) { return res.json(err); };
    return res.json(comment_list);
  });
};

//POST /posts/:postID/comments
module.exports.create_comment = (req, res, next) => {

};

//GET /posts/:postID/comments/:commentID
module.exports.comment_detail = (req, res, next) => {

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