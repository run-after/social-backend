const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FriendRequestSchema = new Schema({
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  requested: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true }
);

module.exports = mongoose.model('FriendRequest', FriendRequestSchema);