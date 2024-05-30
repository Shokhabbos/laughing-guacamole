const mongoose = require("mongoose");

const collectionSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, require: true },
  discreption: { type: String, require: true },
  topic: { type: String, require: true },
  image: { type: String },
  author: { type: String },
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "items",
    },
  ],
});

module.exports = mongoose.model("collection", collectionSchema);
