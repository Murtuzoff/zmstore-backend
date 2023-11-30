import sequelize from "../config/sequelize.js";
import { DataTypes } from "sequelize";
import bcrypt from "bcryptjs";
import AppError from "../errors/AppError.js";

const User = sequelize.define("user", {
  _id: {
    type: DataTypes.UUID,
    defaultValue: sequelize.literal("uuid_generate_v4()"),
    primaryKey: true,
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  name: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
});

// Метод matchPassword() для авторизации пользователя
User.prototype.matchPassword = async function (enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (e) {
    next(AppError.badRequest(e.message));
  }
};

// Метод beforeCreate() перед созданием пользователя
User.beforeCreate(async (user) => {
  try {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
  } catch (e) {
    next(AppError.badRequest(e.message));
  }
});

// Метод beforeUpdate() перед обновлением пользователя
User.beforeUpdate(async (user) => {
  try {
    if (user.changed("password")) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      user.password = hashedPassword;
    }
  } catch (e) {
    next(AppError.badRequest(e.message));
  }
});

export default User;
