import jwt from "jsonwebtoken";
import AppError from "../errors/AppError.js";
import User from "./../models/User.js";

const protect = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      throw new Error("Not authorized, no token");
    }
    if (!req.headers.authorization.startsWith("Bearer")) {
      throw new Error("Not authorized, incorrect token format");
    }

    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      throw new Error("Not authorized, invalid token");
    }

    req.user = await User.findByPk(decoded._id, {
      attributes: { exclude: ["password"] },
    });

    if (!req.user) {
      throw new Error("User not found in database");
    }

    next();
  } catch (e) {
    console.error(e.message);
    next(AppError.forbidden(e.message));
  }
};

const admin = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findByPk(userId);

    if (!user) {
      throw new Error("User not found in database");
    }
    if (!user.isAdmin) {
      throw new Error("Not authorized as an Admin");
    }

    next();
  } catch (e) {
    console.error(e.message);
    next(AppError.forbidden(e.message));
  }
};

export { protect, admin };
