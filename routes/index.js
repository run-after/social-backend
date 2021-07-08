var express = require('express');
var router = express.Router();

const indexController = require('../controllers/indexController');

router.get('/', indexController.home);
router.post('/login', indexController.log_in);

module.exports = router;
