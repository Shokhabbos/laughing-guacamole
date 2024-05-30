const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, require: true },
  text: { type: String, require: true },
  item_id: { type: String, require: true },
});

module.exports = mongoose.model("comments", commentSchema);
