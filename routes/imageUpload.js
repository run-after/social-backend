var express = require('express');
var router = express.Router();
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const User = require('../models/User');
const AmazonS3URI = require('amazon-s3-uri');

aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  region: process.env.AWS_REGION
});

const s3 = new aws.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET,
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, Object.assign({}, req.file));
    },
    key: function (req, file, cb) {
      const extention = file.originalname.split('.')[1];
      cb(null, Date.now().toString() + `.${extention}`);
    }
  })
});

router.post('/:userID/avatar-upload', upload.single('image'), function (req, res, next) {
  // Find user in DB
  const user = User.findById(req.params.userID).exec((err, user) => {
    if (err) { return res.json(err); };
    // if user's avatar is not the default one...
    if (user.avatar !== 'https://social-bucket.s3.us-east-2.amazonaws.com/anon.png') {
      const { key } = AmazonS3URI(user.avatar);
        // Delete old avatar
        s3.deleteObject({
          Bucket: process.env.AWS_BUCKET,
          Key: key
        }, function (err, data) {
          if (err) { return res.json(err); };
        })
      }
  });
  return res.json(req.file.location);
});

router.post('/', upload.single('image'), function (req, res, next) {
  return res.json(req.file.location);
});

module.exports = router;
