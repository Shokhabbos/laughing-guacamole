const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const cloudinary = require("../helpers/cloudinary");

const Collection = require("../modules/collection");
const User = require("../modules/user");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./tmp");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get("/", async (req, res, next) => {
  try {
    const result = await Collection.find()
      .populate({
        path: "items",
        populate: "comments",
      })
      .exec();
    result.sort((a, b) => b.items.length - a.items.length);
    res.status(200).json({
      collections: result,
    });
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
});
router.delete("/delete", async (req, res, next) => {
  try {
    const collectionIds = req.body.collectionIds;
    if (!collectionIds) {
      return res
        .status(404)
        .json({ error: "CollectionIds are required in the request body" });
    }
    const filter = { _id: { $in: collectionIds } };
    await Collection.deleteMany(filter);
    const user = await User.findById(req.body.id);
    console.log(user);
    if (user.role === "admin") {
      const collections = await Collection.find().populate({
        path: "items",
        populate: "comments",
      });
      res.status(200).json({
        message: "Successfully",
        collections: collections,
      });
    } else {
      const doc = await User.findById(req.body.user_id)
        .populate({
          path: "collections",
          populate: { path: "items", populate: "comments" },
        })
        .exec();
      const collections = doc.collections;
      res.status(200).json({
        message: "Successfully",
        collections: collections,
      });
    }
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});
router.get("/:id", async (req, res, next) => {
  try {
    Collection.findById(req.params.id)
      .populate("items")
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
router.post("/add-col", upload.single("image"), async (req, res, next) => {
  console.log(req.body);
  const uploader = async (path) => await cloudinary.uploads(path, "Images");
  const image = req.file;
  const { path } = image;
  const newPath = await uploader(path);
  const collection = new Collection({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    discreption: req.body.discreption,
    image: newPath,
    topic: req.body.topic,
  });
  try {
    const user = await User.findById(req.body.user_id);
    const result = await collection.save();
    user.collections.push(result._id);
    await user.save();
    if (user.role === "admin") {
      const collections = await Collection.find().populate({
        path: "items",
        populate: "comments",
      });
      res.status(200).json({
        message: "Successfully",
        collections: collections,
      });
    } else {
      const doc = await User.findById(req.body.user_id)
        .populate({
          path: "collections",
          populate: { path: "items", populate: "comments" },
        })
        .exec();
      const collections = doc.collections;
      res.status(200).json({
        message: "Successfully",
        collections: collections,
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});
router.delete("/:id", (req, res, next) => {
  Collection.findByIdAndDelete({ _id: req.params.id })
    .exec()
    .then(() => {
      res.status(200).json({
        message: "Collection deleted",
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
      discreption: req.body.discreption,
      image: newPath || req.body.image,
      topic: req.body.topic,
    };
    const options = { new: true };
    await Collection.findByIdAndUpdate(id, updates, options);
    const user = await User.findById(req.body.user_id);
    if (user.role === "admin") {
      const collections = await Collection.find().populate({
        path: "items",
        populate: "comments",
      });
      res.status(200).json({
        message: "Successfully",
        collections: collections,
      });
    } else {
      const doc = await User.findById(req.body.user_id)
        .populate({
          path: "collections",
          populate: { path: "items", populate: "comments" },
        })
        .exec();
      const collections = doc.collections;
      res.status(200).json({
        message: "Successfully",
        collections: collections,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error,
    });
  }
});
module.exports = router;
