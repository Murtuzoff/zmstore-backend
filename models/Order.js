import sequelize from "../config/sequelize.js";
import { DataTypes } from "sequelize";

const Order = sequelize.define("order", {
  _id: {
    type: DataTypes.UUID,
    defaultValue: sequelize.literal("uuid_generate_v4()"),
    primaryKey: true,
  },
  orderItems: {
    type: DataTypes.ARRAY(DataTypes.JSONB),
    allowNull: false,
  },
  shippingAddress: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
  itemsPrice: {
    type: DataTypes.NUMERIC(10, 2),
    allowNull: false,
    defaultValue: 0.0,
  },
  shippingPrice: {
    type: DataTypes.NUMERIC(10, 2),
    allowNull: false,
    defaultValue: 0.0,
  },
  totalPrice: {
    type: DataTypes.NUMERIC(10, 2),
    allowNull: false,
    defaultValue: 0.0,
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  paymentResult: {
    type: DataTypes.JSONB,
  },
  isPaid: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  paidAt: {
    type: DataTypes.DATE,
  },
  isDelivered: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  deliveredAt: {
    type: DataTypes.DATE,
  },
});

export default Order;
