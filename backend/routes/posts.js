import express from "express";
import { Post } from "../models/post.js";

const postRoutes = express.Router();

postRoutes.post("", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });

  post.save().then((createdPost) => {
    res.status(201).json({
      message: "Post added successfully",
      postId: createdPost._id,
    });
  });
});

postRoutes.put("/:id", (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
  });
  Post.updateOne({ _id: req.params.id }, post).then((result) => {
    res.status(200).json({ message: "Post successfully updated" });
  });
});

postRoutes.get("", (req, res, next) => {
  Post.find()
    .then((documents) => {
      res.status(200).json({
        message: "Posts fetched",
        posts: documents,
      });
    })
    .catch((err) => console.log(err));
});

postRoutes.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then((post) => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found :(" });
    }
  });
});

postRoutes.delete("/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then((res) => {
    console.log(res);
  });
  res.status(200).json({
    message: "Post Deleted",
  });
});

export default postRoutes;