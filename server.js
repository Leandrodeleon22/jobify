// import cors from "cors";
import express from "express";
import "express-async-errors";
import dotenv from "dotenv";
// const path = require("path");
const app = express();

dotenv.config();

import mongoose from "mongoose";
import authRouter from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
//middleware
import notFoundMiddleware from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";
import connectDB from "./db/connect.js";
import morgan from "morgan";
import authenticateUser from "./middleware/auth.js";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";
import helmet from "helmet";
import xss from "xss-clean";

import mongoSanitize from "express-mongo-sanitize";

// const __dirname = dirname(fileURLToPath(import.meta.url));

// app.use(express.static(path.resolve(__dirname, "./client/build")));

// app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

// app.get("/", function (req, res) {
//   res.sendFile(path.join(__dirname, "build", "index.html"));
// });

// app.use(express.static(path.join(__dirname, "build")));
// app.get("*", function (request, response) {
//   response.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
// });

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}
app.get("/api/v1", (req, res) => {
  res.send({ msg: "Welcome" });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticateUser, jobRoutes);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
const port = process.env.PORT || 5000;

const start = async () => {
  try {
    mongoose.set("strictQuery", false);
    await connectDB(process.env.MONGO_URL);

    app.listen(port, () => console.log(`server is listening to port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
