const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../modules/user");

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
router.get("/", async (req, res, next) => {
  try {
    const result = await User.find()
      .populate({
        path: "collections",
        populate: { path: "items", populate: "comments" },
      })
      .exec();
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error,
    });
  }
});
router.post("/login", (req, res, next) => {
  console.log(req.body)
  User.findOne({ email: req.body.email }).populate({
      path: "collections",
      populate: { path: "items", populate: "comments" },
    })
  .exec()
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: "Auth failed",
        });
      }
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (err || !result) {
          return res.status(401).json({
            message: "Auth failed",
            error: err,
          });
        }
        user.lstLogTime = getTime();
        user.save();
        const token = jwt.sign(
          {
            email: user.email,
            userId: user._id,
          },
          "secretKey",
          {
            expiresIn: "2h",
          }
        );
        return res.status(200).json({
          message: "Auth successful",
          user: user,
          token: token,
        });
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});
router.post("/signup", async (req, res, next) => {
  try {
    const existingUserEmail = await User.findOne({
      email: req.body.email,
    }).exec();
    const existingUserName = await User.findOne({
      email: req.body.name,
    }).exec();
    if (existingUserName || existingUserEmail) {
      return res.status(422).json({
        message: "Mail or Name exists!",
      });
    }
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      email: req.body.email,
      password: hash,
      lstLogTime: getTime(),
      regTime: getTime(),
      status: true,
    });

    const result = await user.save();
    res.status(201).json({
      message: "User created",
      username: req.body.name,
      status: req.body.status,
    });
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
});
router.post("/add-admin", async (req, res, next) => {
  try {
    const { userIds, promotedBy } = req.body;
    const result = await User.updateMany(
      { _id: { $in: userIds } },
      {
        $set: {
          role: "admin",
          promotedBy: promotedBy,
          removedBy: "none",
        }
      },
      { new: true } 
    );
    return res.status(200).json({
      result: result,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message, 
    });
  }
});
router.post("/rm-admin", async (req, res, next) => {
  try {
    const { userIds, promotedBy } = req.body;
    const result = await User.updateMany(
      { _id: { $in: userIds } },
      {
        $set: {
          role: "user",
          promotedBy: promotedBy,
          removedBy: "none",
        }
      },
      { new: true } 
    );
    return res.status(200).json({
      result: result,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message, 
    });
  }
});
router.patch("/update", async (req, res, next) => {
  try {
    const userIds = req.body.userIds;
    const status = req.body.status;
    if (!userIds || !status) {
      return res
        .status(400)
        .json({ error: "userIds and status are required in the request body" });
    }
    const filter = { _id: { $in: userIds } };
    const update = { $set: { status: status } };
    const result = await User.updateMany(filter, update);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});
router.delete("/delete", async (req, res, next) => {
  try {
    const userIds = req.body.userIds;
    if (!userIds) {
      return res
        .status(400)
        .json({ error: "userIds are required in the request body" });
    }
    const filter = { _id: { $in: userIds } };
    const result = await User.deleteMany(filter);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});
router.get("/:userId", async (req, res, next) => {
  const id = req.params.userId;
  try {
    const doc = await User.findById(id).populate({
      path: "collections",
      populate: { path: "items", populate: "comments" },
    }).exec();
    res.status(200).json(doc);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});
module.exports = router;
