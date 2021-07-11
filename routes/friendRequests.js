var express = require('express');
var router = express.Router();
const friendRequestController = require('../controllers/friendRequestController');

router.post('/:requestedID', friendRequestController.create_friend_request);
router.delete('/:requestedID', friendRequestController.delete_friend_request);

module.exports = router;