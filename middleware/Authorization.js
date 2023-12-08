// import jwt from "jsonwebtoken";
import AppError from "../errors/AppError.js";
import User from "./../models/User.js";

const protect = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      throw new Error("Не авторизован, нет токена");
    }
    if (!req.headers.authorization.startsWith("Bearer")) {
      throw new Error("Не авторизован, неверный формат токена");
    }

    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      throw new Error("Не авторизован, недействительный токен");
    }

    req.user = await User.findByPk(decoded._id, {
      attributes: { exclude: ["password"] },
    });

    if (!req.user) {
      throw new Error("Пользователь не найден в БД");
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
      throw new Error("Пользователь не найден в БД");
    }
    if (!user.isAdmin) {
      throw new Error("Не авторизован в качестве Администратора");
    }

    next();
  } catch (e) {
    console.error(e.message);
    next(AppError.forbidden(e.message));
  }
};

export { protect, admin };
