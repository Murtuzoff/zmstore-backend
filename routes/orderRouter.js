import express from "express";
import { protect, admin } from "./../middleware/Authorization.js";
import orderController from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/", protect, orderController.create);
orderRouter.get("/all", protect, admin, orderController.allAdmin);
orderRouter.get("/", protect, orderController.all);
orderRouter.get("/:id", protect, orderController.single);
orderRouter.put("/:id/paid", protect, orderController.paid);
orderRouter.put("/:id/delivered", protect, admin, orderController.delivered);

export default orderRouter;
