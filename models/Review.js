import sequelize from "../config/sequelize.js";
import { DataTypes } from "sequelize";

const Review = sequelize.define("review", {
  _id: {
    type: DataTypes.UUID,
    defaultValue: sequelize.literal("uuid_generate_v4()"),
    primaryKey: true,
  },
  userName: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  rating: {
    type: DataTypes.NUMERIC(2, 1),
    allowNull: false,
  },
  comment: {
    type: DataTypes.STRING(4096),
    allowNull: false,
  },
});

export default Review;
