import jwt from "jsonwebtoken";

export const checkAuth = function (req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt
      .verify(token, "SECRET_keeping_secrets_is_a_good_ability:)By-Har")
      next();
  } catch (err) {
    res.status(401).json({
      message: "Failed!!!",
    });
  }
};
