const FriendRequest = require('../models/FriendRequest');

module.exports.friend_request_list = (req, res, next) => {
  FriendRequest.find().exec((err, request_list) => {
    if (err) { return res.json(err); };
    return res.json(request_list);
  });
};

module.exports.create_friend_request = (req, res, next) => {
  const friendRequest = new FriendRequest({
    requester: req.user,
    requested: req.params.requestedID
  });

  friendRequest.save((err, request) => {
    if (err) { return res.json(err); };
    return res.json(request);
  });
};

module.exports.delete_friend_request = (req, res, next) => {
  FriendRequest.findById(req.params.requestedID).deleteOne().exec((err, request) => {
    if (err) { return res.json(err); };
    return res.json(request);
  });
};