const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const Comments = require("../modules/comments");
const Items = require("../modules/items");
const comments = require("../modules/comments");

router.get("/", async (req, res, next) => {
  try {
    const result = await Comments.find().exec();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
});
router.post("/add-com", async (req, res, next) => {
  try {
    if (!req.body.name || !req.body.text || !req.body.item_id) {
      return res.status(404).json({
        error: "Username, Text or item_id not given",
      });
    }
    const item = await Items.findById(req.body.item_id).exec();
    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }
    const comment = new Comments({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      text: req.body.text,
      item_id: req.body.item_id,
    });

    const result = await comment.save();
    item.comments.push(comment._id);
    await item.save();
    const newItem = await Items.findById(req.body.item_id)
      .populate("comments")
      .exec();
    res.status(200).json({
      message: "Successfully",
      comment: result,
      item: newItem,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});
router.patch("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const updates = {
      text: req.body.text,
    };
    const options = { new: true };
    const result = await Comments.findByIdAndUpdate(id, updates, options);
    return res.status(200).json({
      result: result,
      message: "Comment updated.",
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});
router.delete("/:id", async (req, res, next) => {
  try {
    comments
      .findByIdAndDelete({ _id: req.params.id })
      .exec()
      .then((result) => {
        return res.status(200).json({
          message: "Succesfully deleted",
          result: result,
        });
      });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
module.exports = router;
