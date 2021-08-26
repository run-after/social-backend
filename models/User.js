const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: {type: String, required: true, unique: true},
  password: { type: String, required: true },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],// Array of friends
  isFacebookLogin: { type: Boolean, default: false },
  facebookID: { type: String },
  avatar: { type: String, default: 'https://social-bucket.s3.us-east-2.amazonaws.com/anon.png'}
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);