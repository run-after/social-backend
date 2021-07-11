const FriendRequest = require('../models/FriendRequest');

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
  FriendRequest.find({ 'requester': req.user, 'requested': req.params.requestedID }).deleteOne().exec((err, request) => {
    if (err) { return res.json(err); };
    return res.json(request);
  });
};