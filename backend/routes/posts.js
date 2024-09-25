import express from "express";
import { checkAuth } from "../middleware/check-auth.js";
import {
  createPost,
  deletePost,
  getPost,
  getPosts,
  updatePost,
} from "../controllers/post.js";
import { uploadFileMulter } from "../middleware/file.js";

const postRoutes = express.Router();


postRoutes.post(
  "",
  checkAuth,
  uploadFileMulter,
  createPost
);

postRoutes.put(
  "/:id",
  checkAuth,
  uploadFileMulter,
  updatePost
);

postRoutes.get("", getPosts);

postRoutes.get("/:id", getPost);

postRoutes.delete("/:id", checkAuth, deletePost);

export default postRoutes;
