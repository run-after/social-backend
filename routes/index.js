var express = require('express');
var router = express.Router();

const indexController = require('../controllers/indexController');

router.get('/', indexController.home);
router.post('/login', indexController.log_in);
router.post('/signup', indexController.sign_up);

module.exports = router;
