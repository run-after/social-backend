var express = require('express');
var router = express.Router();

const indexController = require('../controllers/indexController');

router.get('/', indexController.home);
router.post('/login', indexController.log_in);
router.post('/users', indexController.create_user);

module.exports = router;
