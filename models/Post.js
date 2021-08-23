const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isPicture: { type: Boolean, defaultValue: false }
}, { timestamps: true }
);

module.exports = mongoose.model('Post', PostSchema);