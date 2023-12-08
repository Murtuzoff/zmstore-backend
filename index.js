import config from "dotenv/config";
import connectDatabase from "./config/database.js";
import express from "express";
import cors from "cors";
import mainRouter from "./routes/mainRouter.js";
import fileUpload from "express-fileupload";
import ErrorHandler from "./middleware/ErrorHandler.js";

connectDatabase();
const app = express();
app.use(cors());
app.use(express.static("static"));
app.use(fileUpload());
app.use(express.json());
app.use("/api", mainRouter);
app.use(ErrorHandler);

app.get("/api", async (req, res) => {
  res.json({ message: "Hello, world!" });
});

const PORT = process.env.PORT || 7000;

app.listen(PORT, () => console.log("Сервер запущен на порту", PORT));
