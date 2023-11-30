import express from "express";
import { protect, admin } from "./../middleware/Authorization.js";
import userController from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/signup", userController.signup);
userRouter.post("/login", userController.login);
userRouter.get("/profile", protect, userController.profile);
userRouter.put("/update", protect, userController.update);
userRouter.get("/all", protect, admin, userController.allAdmin);

export default userRouter;
