import express from "express";
import bodyParser from "body-parser";
import { Post } from "./models/post.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const DB_CONNECTION = process.env.DB_CONNECTION;

const app = express();
mongoose
  .connect(DB_CONNECTION)
  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With,Content-Type,Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  next();
});

app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });

  post.save();
  res.status(201).json({
    message: "Post added successfully",
  });
});

app.get("/api/posts", (req, res, next) => {
  Post.find()
    .then((documents) => {
      res.status(200).json({
        message: "Posts fetched",
        posts: documents,
      });
    })
    .catch((err) => console.log(err));
});

export default app;
