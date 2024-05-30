const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
mongoose.connect(
  "mongodb+srv://urinovs999:uVWUJI0YzlGffkS3@cluster0.penov4i.mongodb.net/?retryWrites=true&w=majority"
);
const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  optionsSuccessStatus: 204,
};
const userRoutes = require("./api/routes/user");
const collectionRoutes = require("./api/routes/collection");
const itemRoutes = require("./api/routes/items");
const commentRoutes = require("./api/routes/comments");

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(corsOptions));
app.use("/uploads", express.static("uploads"));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
    return res.status(200).json({});
  }
  next();
});

app.use("/user", userRoutes);
app.use("/collection", collectionRoutes);
app.use("/item", itemRoutes);
app.use("/comment", commentRoutes);

app.use((req, res, next) => {
  const error = new Error("This route is not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: error.message,
  });
});
module.exports = app;
