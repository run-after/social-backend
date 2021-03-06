var express = require('express');
var router = express.Router();

const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');

router.get('/', postController.post_list);
router.post('/', postController.create_post);
router.get('/:postID', postController.post_detail);
router.put('/:postID', postController.edit_post);
router.delete('/:postID', postController.delete_post);
router.get('/:postID/likes', postController.get_likes);
router.post('/:postID/likes', postController.like_post);
router.delete('/:postID/likes', postController.unlike_post);

router.get('/:postID/comments', commentController.comment_list);
router.post('/:postID/comments', commentController.create_comment);
router.get('/:postID/comments/:commentID', commentController.comment_detail);
router.put('/:postID/comments/:commentID', commentController.edit_comment);
router.delete('/:postID/comments/:commentID', commentController.delete_comment);
router.get('/:postID/comments/:commentID/likes', commentController.get_likes);
router.post('/:postID/comments/:commentID/likes', commentController.like_comment);
router.delete('/:postID/comments/:commentID/likes', commentController.unlike_comment);

module.exports = router;
