import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config.js";

export const authRequired = (req, res, next) => {
  const { access_token } = req.cookies;
  if (!access_token) return res.status(401).json({ message: "Unauthenticated" });

  jwt.verify(access_token, SECRET_KEY, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(403).json({ message: "Invalid Token" });
    }
    req.user = user;
    next();
  });
};
