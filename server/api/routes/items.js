const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const cloudinary = require("../helpers/cloudinary");

const Items = require("../modules/items");
const Collection = require("../modules/collection");
const Comments = require("../modules/comments");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./tmp");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
function getTime() {
  const currentDateAndTime = new Date();
  const year = currentDateAndTime.getFullYear();
  const month = currentDateAndTime.getMonth() + 1;
  const day = currentDateAndTime.getDate();
  const hours = currentDateAndTime.getHours();
  const minutes = currentDateAndTime.getMinutes();
  const seconds = currentDateAndTime.getSeconds();
  const formattedDateAndTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  return formattedDateAndTime;
}
const upload = multer({ storage: storage });
router.get("/", async (req, res, next) => {
  try {
    const result = await Items.find()
      .sort({ date: -1 })
      .populate("comments")
      .exec();
    const tags = [];
    result.forEach((element) => {
      element.tags.split("#").forEach((tag) => {
        !tags.includes(tag) && tag.length > 0 && tags.push(tag);
      });
    });
    res.status(200).json({
      result: result,
      tags: tags,
    });
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
});
router.get("/search", async (req, res, next) => {
  try {
    const { key } = req.query;
    const { tag } = req.query;
    if (key) {
      const regexKey = new RegExp(key, "i");
      const collections = await Collection.find({
        name: { $regex: regexKey },
      }).exec();
      const comments = await Comments.find({
        text: { $regex: regexKey },
      }).exec();
      const items = await Items.find({
        name: { $regex: regexKey },
      }).exec();
      if (collections || comments || items) {
        const result = {
          collections,
          comments,
          items,
        };
        res.status(200).json({
          result: result,
        });
      }
    }
    if (tag) {
      const regexKey = new RegExp(tag, "i");
      const items = await Items.find({ tags: { $regex: regexKey } }).exec();
      if (items) {
        const result = {
          items,
        };
        res.status(200).json({
          result: result,
        });
      }
    }
  } catch (error) {
    console.error("Error in search:", error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
});
router.get("/:id", async (req, res, next) => {
  try {
    Items.findById(req.params.id)
      .populate("comments")
      .exec()
      .then((result) => {
        res.status(200).json(result);
      });
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
});
router.delete("/delete", async (req, res, next) => {
  try {
    const itemIds = req.body.itemIds;
    if (!itemIds) {
      return res
        .status(404)
        .json({ error: "ItemIds are required in the request body" });
    }
    const filter = { _id: { $in: itemIds } };
    await Items.deleteMany(filter);
    const collection = await Collection.findById(
      req.body.collection_id
    ).populate({
      path: "items",
      populate: "comments",
    });
    return res.status(200).json({
      message: "Successfully",
      result: collection,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});
router.post("/add-item", upload.single("image"), async (req, res, next) => {
  const uploader = async (path) => await cloudinary.uploads(path, "Images");
  const image = req.file;
  const { path } = image;
  const newPath = await uploader(path);
  const item = new Items({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    image: newPath,
    tags: req.body.tags,
    additionalInfo: req.body.additionalInfo,
    date: getTime(),
    like: 0,
  });

  await item.save();
  const collection = await Collection.findById(req.body.collection_id);
  if (!collection) {
    throw Error("Collection not found");
  }

  collection.items.push(item.id);
  await collection.save();
  const collectionR = await Collection.findById(req.body.collection_id)
    .populate({
      path: "items",
      populate: "comments",
    })
    .exec();
  try {
    res.status(200).json({
      message: "Successfully",
      item: collectionR,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});
router.post("/like/:id", async (req, res, next) => {
  try {
    const item = await Items.findById(req.params.id)
      .populate("comments")
      .exec();
    if (!item.likes.includes(req.body.id)) {
      item.likes.push(req.body.id);
      await item.save();
      return res.status(200).json({
        item: item,
      });
    }
    return res.status(500).json({
      message: "Already Liked",
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});
router.post("/unlike/:id", async (req, res, next) => {
  try {
    const item = await Items.findById(req.params.id)
      .populate("comments")
      .exec();
    const index = item.likes.indexOf(req.body.id);
    if (index !== -1) {
      item.likes.splice(index, 1);
      await item.save();
      return res.status(200).json({
        item: item,
      });
    }
    return res.status(500).json({
      message: "Already Unliked",
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});
router.delete("/:id", (req, res, next) => {
  Items.findByIdAndDelete({ _id: req.params.id })
    .exec()
    .then(() => {
      res.status(200).json({
        message: "Item deleted",
        status: 200,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});
router.patch("/:id", upload.single("image"), async (req, res, next) => {
  try {
    var newPath = "";
    if (req.file) {
      const uploader = async (path) => await cloudinary.uploads(path, "Images");
      const image = req.file;
      const { path } = image;
      newPath = await uploader(path);
    }
    const id = req.params.id;
    const updates = {
      name: req.body.name,
      image: newPath || req.body.image,
      tags: req.body.tags,
      additionalInfo: req.body.additionalInfo,
    };
    const options = { new: true };
    await Items.findByIdAndUpdate(id, updates, options);
    const collectionR = await Collection.findById(req.body.collection_id)
      .populate({
        path: "items",
        populate: "comments",
      })
      .exec();
    return res.status(200).json({
      message: "Successfully",
      item: collectionR,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error,
    });
  }
});
module.exports = router;
