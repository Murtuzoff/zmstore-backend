import sequelize from "../config/sequelize.js";
import { DataTypes } from "sequelize";

const Product = sequelize.define("product", {
  _id: {
    type: DataTypes.UUID,
    defaultValue: sequelize.literal("uuid_generate_v4()"),
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rating: {
    type: DataTypes.NUMERIC(2, 1),
    allowNull: false,
    defaultValue: 0,
  },
  numReviews: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  price: {
    type: DataTypes.NUMERIC(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  countInStock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
});

export default Product;
