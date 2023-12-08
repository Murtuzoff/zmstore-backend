import express from "express";
import orderRouter from "./orderRouter.js";
// import PayPalRouter from "./PayPalRouter.js";
// import productRouter from "./productRouter.js";
// import userRouter from "./userRouter.js";

const mainRouter = express.Router();

// mainRouter.use("/order", orderRouter);
// mainRouter.use("/paypal", PayPalRouter);
// mainRouter.use("/product", productRouter);
// mainRouter.use("/user", userRouter);

export default mainRouter;
