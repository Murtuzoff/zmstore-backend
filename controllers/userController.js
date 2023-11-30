import User from "./../models/User.js";
import AppError from "../errors/AppError.js";
import { generateUserToken } from "./../utils/tokenGenerator.js";

const userController = {
  // АВТОРИЗАЦИЯ ПОЛЬЗОВАТЕЛЯ (POST)
  async login(req, res, next) {
    try {
      const email = req.body.email;
      const password = req.body.password;

      const user = await User.findOne({ where: { email } });

      if (!(user && (await user.matchPassword(password)))) {
        throw new Error("Неверный логин или пароль");
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
        token: generateUserToken(user._id),
      });
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  },

  // РЕГИСТРАЦИЯ ПОЛЬЗОВАТЕЛЯ (POST)
  async signup(req, res, next) {
    try {
      const name = req.body.name;
      const email = req.body.email;
      const password = req.body.password;

      if (!name) {
        throw new Error("Не указано имя пользователя");
      }

      if (!email) {
        throw new Error("Не указан email пользователя");
      }

      const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Некорректный формат email");
      }

      if (!password) {
        throw new Error("Не указан пароль пользователя");
      }

      const existingUser = await User.findOne({ where: { email } });

      if (existingUser) {
        throw new Error("Пользователь уже существует в БД");
      }

      const user = await User.create({
        name,
        email,
        password,
      });

      if (!user) {
        throw new Error("Ошибка регистрации пользователя в БД");
      }

      res.json({});
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  },

  // ЗАПРОС ПОЛЬЗОВАТЕЛЯ USER (GET)
  async profile(req, res, next) {
    try {
      const user = await User.findByPk(req.user._id);

      if (!user) {
        throw new Error("Пользователь не найден в БД");
      }

      res.json({});
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  },

  // ОБНОВЛЕНИЕ ПОЛЬЗОВАТЕЛЯ USER (PUT)
  async update(req, res, next) {
    try {
      const user = await User.findByPk(req.user._id);

      if (!user) {
        throw new Error("Пользователь не найден в БД");
      }

      const name = req.body.name ?? user.name;
      const email = req.body.email ?? user.email;
      const password = req.body.password ?? user.password;

      await user.update({
        name,
        email,
        password,
      });

      if (!user) {
        throw new Error("Ошибка обновления пользователя в БД");
      }

      res.json({});
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  },

  // ЗАПРОС ВСЕХ ПОЛЬЗОВАТЕЛЕЙ (GET)
  async allAdmin(req, res, next) {
    try {
      const users = await User.findAll();

      res.json(users);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  },
};

export default userController;
