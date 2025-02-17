import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";
export const verifyUser = (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) return next(errorHandler(401, "unauthorized"));
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) return next(errorHandler(400, "forbidden"));
    req.user = decode;
    next();
  } catch (error) {
    next(error);
  }
};
