var express = require('express');
var router = express.Router();

const userController = require('../controllers/userController');

router.get('/', userController.user_list);
router.get('/:userID', userController.user_details);
router.put('/:userID', userController.edit_user_details);
router.delete('/:userID', userController.delete_user);
router.get('/:userID/posts', userController.get_user_posts);
router.get('/:userID/comments', userController.get_user_comments);

module.exports = router;