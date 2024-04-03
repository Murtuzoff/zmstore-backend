import User from "./../models/User.js";
import AppError from "../errors/AppError.js";
import { generateUserToken } from "./../utils/tokenGenerator.js";

const userController = {
  // USER AUTHORIZATION (POST)
  async login(req, res, next) {
    try {
      const email = req.body.email;
      const password = req.body.password;

      const user = await User.findOne({ where: { email } });

      if (!(user && (await user.matchPassword(password)))) {
        throw new Error("Wrong login or password");
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

  // USER REGISTRATION (POST)
  async signup(req, res, next) {
    try {
      const name = req.body.name;
      const email = req.body.email;
      const password = req.body.password;

      if (!name) {
        throw new Error("Username not specified");
      }

      if (!email) {
        throw new Error("User email is not specified");
      }

      const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Invalid email format");
      }

      if (!password) {
        throw new Error("User password not specified");
      }

      const existingUser = await User.findOne({ where: { email } });

      if (existingUser) {
        throw new Error("The user already exists in the database");
      }

      const user = await User.create({
        name,
        email,
        password,
      });

      if (!user) {
        throw new Error("Error registering user in database");
      }

      res.json({});
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  },

  // GET USER PROFILE (GET)
  async profile(req, res, next) {
    try {
      const user = await User.findByPk(req.user._id);

      if (!user) {
        throw new Error("User not found in database");
      }

      res.json({});
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  },

  // UPDATE USER PROFILE (PUT)
  async update(req, res, next) {
    try {
      const user = await User.findByPk(req.user._id);

      if (!user) {
        throw new Error("User not found in database");
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
        throw new Error("Error updating user in database");
      }

      res.json({});
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  },

  // GET ALL USERS (GET)
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
