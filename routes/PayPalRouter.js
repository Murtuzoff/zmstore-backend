import express from "express";
import { protect } from "./../middleware/Authorization.js";
import PayPalController from "../controllers/PayPalController.js";

const PayPalRouter = express.Router();

PayPalRouter.post("/", PayPalController.create);
PayPalRouter.post("/:orderID/capture", PayPalController.capture);

export default PayPalRouter;
