const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  videoUrl: String,
  commenterName: String,
  commenterNameMasked: String,
  commentText: String,
  sentiment: String,
  publishedAt: Date,
});

module.exports = mongoose.model("Comment", CommentSchema);
