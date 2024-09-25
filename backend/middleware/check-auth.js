import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

export const checkAuth = function (req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(
      token,
      SECRET_KEY
    );
    req.userData = {
      email: decodedToken.email,
      userId: decodedToken.userId,
    };
    next();
  } catch (err) {
    res.status(401).json({
      message: "You are not authenticated",
    });
  }
};
