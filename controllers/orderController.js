import Order from "./../models/Order.js";
import AppError from "../errors/AppError.js";
import User from "./../models/User.js";

const orderController = {
  // ЗАПРОС ОДНОГО ЗАКАЗА ПО ID (GET)
  async single(req, res, next) {
    try {
      const order = await Order.findByPk(req.params.id, {
        include: [{ model: User, attributes: ["_id", "name", "email"] }],
      });

      if (!order) {
        throw new Error("Заказ не найден в БД");
      }

      if (order.userId !== req.user._id) {
        throw new Error("Заказ не соответствует пользователю");
      }

      res.json(order);
    } catch (e) {
      if (e.message.startsWith("invalid input syntax for type uuid")) {
        next(AppError.badRequest("Запрос не соответствует UUID заказа"));
      } else {
        next(AppError.badRequest(e.message));
      }
    }
  },

  // ДОБАВЛЕНИЕ ЗАКАЗА (POST)
  async create(req, res, next) {
    try {
      const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        totalPrice,
      } = req.body;

      const userId = req.user._id;

      if (orderItems && orderItems.length === 0) {
        throw new Error("Товары для заказа отсутствуют");
      }

      const order = await Order.create({
        userId,
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        totalPrice,
      });

      res.json(order);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  },

  // ОПЛАТА ЗАКАЗА ПО ID (PUT)
  async paid(req, res, next) {
    try {
      const order = await Order.findByPk(req.params.id);

      if (!order) {
        throw new Error("Заказ не найден в БД");
      }

      if (order.userId !== req.user._id) {
        throw new Error("Заказ не соответствует пользователю");
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

      res.json(order);
    } catch (e) {
      next(AppError.badRequest(e.message));
    }
  },

  // ДОСТАВКА ЗАКАЗА ПО ID (PUT)
  async delivered(req, res, next) {
    try {
      const order = await Order.findByPk(req.params.id);

      if (!order) {
        throw new Error("Заказ не найден в БД");
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

  // ЗАПРОС ВСЕХ ЗАКАЗОВ USER (GET)
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

  // ЗАПРОС ВСЕХ ЗАКАЗОВ ADMIN (GET)
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
