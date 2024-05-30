const mongoose = require("mongoose");
 

const itemSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, require: true },
  tags: { type: String, require: true },
  image: {type: String},
  comments: 
    {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "comments",
    },
  likes: {type: Array},
  additionalInfo: {type: Array},
  date:{type:String}
});

module.exports = mongoose.model("items", itemSchema);
