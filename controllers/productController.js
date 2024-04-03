import { Op } from "sequelize";
import { saveFile, deleteFile } from "./../utils/fileUtils.js";
import Product from "./../models/Product.js";
import Review from "./../models/Review.js";
import Order from "./../models/Order.js";
import AppError from "../errors/AppError.js";

const productController = {
  // USER GET ALL PRODUCTS (GET)
  async all(req, res, next) {
    try {
      const pageLimit = 3;
      const pageCurrent = Number(req.query.pagenumber || 1);

      const keyword = req.query.keyword
        ? { name: { [Op.iLike]: `%${req.query.keyword}%` } }
        : {};

      const count = await Product.count({ where: keyword });

      const productArray = await Product.findAll({
        where: keyword,
        limit: pageLimit,
        offset: pageLimit * (pageCurrent - 1),
        order: [["_id", "DESC"]],
      });

      res.json({
        productArray,
        pageCurrent,
        pageCount: Math.ceil(count / pageLimit),
      });
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  },

  // USER GET PRODUCT BY ID (GET)
  async single(req, res, next) {
    try {
      if (!req.params.id) {
        throw new Error("Product ID not specified");
      }

      const product = await Product.findByPk(req.params.id);

      if (!product) {
        throw new Error("Product not found in database");
      }

      const reviews = await Review.findAll({
        where: { productId: req.params.id },
      });

      product.dataValues.reviews = reviews;

      res.json(product);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  },

  // ADD REVIEW BY PRODUCT ID (POST)
  async review(req, res, next) {
    try {
      if (!req.params.id) {
        throw new Error("Product ID not specified");
      }
      if (!req.user._id) {
        throw new Error("User ID not specified");
      }
      if (!req.user.name) {
        throw new Error("Username not specified");
      }

      const userName = req.user.name;
      const { rating, comment } = req.body;
      const userId = req.user._id;
      const productId = req.params.id;

      const product = await Product.findByPk(productId);

      if (!product) {
        throw new Error("Product not found in database");
      }

      const foundOrders = await Order.findAll({
        where: { userId },
      });

      const foundProduct = foundOrders.find((order) =>
        order.orderItems.find((product) => product._id === productId)
      );

      if (!foundProduct) {
        res.json({
          message: "Please order the product and wait for it to be delivered",
        });

        return;
      }

      if (!foundProduct.isPaid) {
        res.json({
          message: "Please pay for the product and wait for it to be delivered",
        });

        return;
      }

      if (!foundProduct.isDelivered) {
        res.json({
          message: "Please wait for the product to be delivered",
        });

        return;
      }

      const existingReview = await Review.findOne({
        where: { userId, productId },
      });

      if (existingReview) {
        res.json({
          message: "You have already left a review for this product",
        });

        return;
      }

      await Review.create({
        userName,
        rating,
        comment,
        userId,
        productId,
      })

        .then(() => {
          return Review.findAll({ where: { productId } });
        })

        .then((reviews) => {
          const reviewSum = reviews.length;
          const ratingSum = reviews.reduce(
            (acc, item) => acc + Number(item.rating),
            0
          );

          const averageRating = ratingSum / reviewSum;

          return product.update({
            rating: averageRating,
            numReviews: reviewSum,
          });
        });

      res.json({});
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  },

  // ADMIN GET ALL PRODUCTS (GET)
  async allAdmin(req, res, next) {
    try {
      const products = await Product.findAll({
        order: [["_id", "DESC"]],
      });

      res.json(products);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  },

  // ADD NEW PRODUCT (POST)
  async create(req, res, next) {
    try {
      const { name, description, price, countInStock } = req.body;
      const existingProduct = await Product.findOne({ where: { name } });

      if (existingProduct) {
        throw new Error("A product with the same name already exists");
      }

      const image = (await saveFile(req.files?.image)) ?? "";

      const product = await Product.create({
        name,
        image,
        description,
        price,
        countInStock,
      });

      res.json(product);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  },

  // UPDATE PRODUCT BY ID (PUT)
  async update(req, res, next) {
    try {
      if (!req.params.id) {
        throw new Error("Product ID not specified");
      }

      const product = await Product.findByPk(req.params.id);

      if (!product) {
        throw new Error("Product not found in database");
      }

      const name = req.body.name ?? product.name;
      const image = (await saveFile(req.files?.image)) ?? product.image;
      const description = req.body.description ?? product.description;
      const price = req.body.price ?? product.price;
      const countInStock = req.body.countInStock ?? product.countInStock;

      await product.update({
        name,
        image,
        description,
        price,
        countInStock,
      });

      res.json(product);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  },

  // DELETE PRODUCT BY ID (DELETE)
  async delete(req, res, next) {
    try {
      if (!req.params.id) {
        throw new Error("Product ID not specified");
      }

      const product = await Product.findByPk(req.params.id);

      if (!product) {
        throw new Error("Product not found in database");
      }

      const productImage = product.image;

      await product.destroy();

      if (productImage) {
        await deleteFile(productImage);
      }

      res.json({});
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  },
};

export default productController;
