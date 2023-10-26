import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import errorHandler from "./middleware/errorHandler.js";
import upload from "./utils/multer.js";
import connectDB from "./mongodb/connect.js";

import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import productRouter from "./routes/product.routes.js";
import orderRouter from "./routes/order.routes.js";
import shoppingRouter from "./routes/shopping.routes.js";

dotenv.config();

const app = express();

app.use(cors({ credentials: true, origin: process.env.ACCESS_URL }));
app.use(errorHandler);
app.use(cookieParser());

// for application/x-www-form-urlencoded
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// for parsing multipart/form-data and max 5 files upload
app.use(upload.array("upload", 5));

app.get("/", (req, res) => {
  res.send("Hello world");
});

// Router Paths
const routes = express.Router();

routes.use("/auth", authRouter);
routes.use("/users", userRouter);
routes.use("/products", productRouter);
routes.use("/orders", orderRouter);
routes.use("/shopping", shoppingRouter);

app.use(`${process.env.API_URL}`, routes); // Base URL for API requests

const startServer = () => {
  try {
    connectDB(process.env.MONGODB_URL);

    app.listen(process.env.PORT || 8080, () => {
      console.log(`Server running on port ${process.env.PORT || 8080}`);
    });
  } catch (err) {
    console.log(err);
  }
};

startServer();
