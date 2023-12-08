import express from "express";
import { protect, admin } from "./../middleware/Authorization.js";
import productController from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.get("/", async (req, res) => {
  res.json({ message: "Hello, world!" });
});

// productRouter.get("/all", protect, admin, productController.allAdmin);
// productRouter.get("/", productController.all);
// productRouter.get("/:id", productController.single);
// productRouter.post("/create", protect, admin, productController.create);
// productRouter.post("/:id/review", protect, productController.review);
// productRouter.put("/:id/update", protect, admin, productController.update);
// productRouter.delete("/:id/delete", protect, admin, productController.delete);

export default productRouter;
