import User from "../models/User.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Review from "../models/Review.js";

const setupModelRelations = () => {
  User.hasMany(Order, {
    onDelete: "CASCADE",
  });
  Order.belongsTo(User);

  User.hasMany(Review);
  Review.belongsTo(User);

  User.belongsToMany(Product, {
    through: Review,
    onDelete: "CASCADE",
  });

  Product.hasMany(Review);
  Review.belongsTo(Product);

  Product.belongsToMany(User, {
    through: Review,
    onDelete: "CASCADE",
  });
};

export default setupModelRelations;
