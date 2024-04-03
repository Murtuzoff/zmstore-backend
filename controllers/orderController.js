import Order from "./../models/Order.js";
import AppError from "../errors/AppError.js";
import User from "./../models/User.js";
import Product from "./../models/Product.js";

const orderController = {
  // GET ORDER BY ID (GET)
  async single(req, res, next) {
    try {
      const order = await Order.findByPk(req.params.id, {
        include: [{ model: User, attributes: ["_id", "name", "email"] }],
      });

      if (!order) {
        throw new Error("Order not found in database");
      }

      if (!req.user.isAdmin && order.userId !== req.user._id) {
        throw new Error("The order does not match the user's order");
      }

      if (!order.isPaid) {
        const updatedItemsArray = [];

        await Promise.all(
          order.orderItems.map(async (item) => {
            const product = await Product.findByPk(item._id);

            const updatedItem = {
              ...item,
              name: product.name,
              image: product.image,
              price: product.price,
            };

            if (updatedItem.quantity >= product.countInStock) {
              updatedItem.quantity = product.countInStock;
            }

            if (Number(updatedItem.quantity) === 0) return;

            updatedItemsArray.push(updatedItem);
          })
        );

        if (updatedItemsArray.length === 0) {
          await order.destroy();
          throw new Error("Sorry, the products on your list are out of stock");
        }

        const itemsPrice = Number(
          updatedItemsArray
            .reduce((acc, item) => acc + item.quantity * item.price, 0)
            .toFixed(2)
        );
        const shippingPrice = itemsPrice === 0 || itemsPrice > 30 ? 0 : 5;
        const totalPrice = itemsPrice + shippingPrice;

        await order.update({
          orderItems: updatedItemsArray,
          itemsPrice,
          shippingPrice,
          totalPrice,
        });
      }

      res.json(order);
    } catch (e) {
      if (e.message.startsWith("invalid input syntax for type uuid")) {
        next(AppError.badRequest("The request does not match the order UUID"));
      } else {
        next(AppError.badRequest(e.message));
      }
    }
  },

  // ADD ORDER (POST)
  async create(req, res, next) {
    try {
      const { orderItems, shippingAddress, paymentMethod } = req.body;

      const userId = req.user._id;

      if (orderItems && orderItems.length === 0) {
        throw new Error("There are no products to order");
      }

      const order = await Order.create({
        userId,
        orderItems,
        shippingAddress,
        paymentMethod,
      });

      res.json(order);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  },

  // PAY BY ORDER ID (PUT)
  async paid(req, res, next) {
    try {
      const order = await Order.findByPk(req.params.id);

      if (!order) {
        throw new Error("Order not found in database");
      }

      if (order.userId !== req.user._id) {
        throw new Error("The order does not match the user's order");
      }

      const { payer, transaction } = req.body;

      const paymentResult = {
        id: transaction.id,
        status: transaction.status,
        updateTime: transaction.update_time,
        emailAddress: payer.email_address,
      };
      const isPaid = true;
      const paidAt = transaction.update_time;

      await order.update({
        paymentResult,
        isPaid,
        paidAt,
      });

      await Promise.all(
        order.orderItems.map(async (item) => {
          const product = await Product.findByPk(item._id);

          const diff = Number(product.countInStock) - Number(item.quantity);
          const countInStock = diff > 0 ? diff : 0;

          await product.update({ countInStock });
        })
      );

      res.json(order);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  },

  // DELIVERY BY ORDER ID (PUT)
  async delivered(req, res, next) {
    try {
      const order = await Order.findByPk(req.params.id);

      if (!order) {
        throw new Error("Order not found in database");
      }

      const isDelivered = true;
      const deliveredAt = Date.now();

      await order.update({
        isDelivered,
        deliveredAt,
      });

      res.json(order);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  },

  // USER GET ORDER LIST (GET)
  async all(req, res, next) {
    try {
      const userId = req.user._id;

      const orders = await Order.findAll({
        where: { userId },
        order: [["_id", "DESC"]],
      });

      res.json(orders);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  },

  // ADMIN GET ALL ORDER LIST (GET)
  async allAdmin(req, res, next) {
    try {
      const orders = await Order.findAll({
        order: [["_id", "DESC"]],
        include: [{ model: User, attributes: ["_id", "name", "email"] }],
      });

      res.json(orders);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  },
};

export default orderController;
