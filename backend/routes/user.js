import express from "express";
import { createUser, loginUser } from "../controllers/user.js";

const userRoutes = express.Router();

userRoutes.post("/signup", createUser);

userRoutes.post("/login", loginUser);

export default userRoutes;
