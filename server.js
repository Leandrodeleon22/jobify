// import cors from "cors";
import express from "express";
import "express-async-errors";
import dotenv from "dotenv";
import cors from "cors";
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

const __dirname = dirname(fileURLToPath(import.meta.url));

// app.use(express.static(path.resolve(__dirname, "./client/build")));

app.use(cors());

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   next();
// });

// app.use(function (req, res, next) {
//   // Allow any domain to access the resource
//   res.header("Access-Control-Allow-Origin", "*");

//   // Allow only GET and POST requests
//   res.header("Access-Control-Allow-Methods", "GET, POST");

//   // Allow the following request headers
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );

// Call next() to move on to the next middleware in the chain
//   next();
// });

app.use(express.json());
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

// app.get("/", function (req, res) {
//   res.sendFile(path.join(__dirname, "build", "index.html"));
// });

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.resolve(__dirname, "./client/build")));
//   app.get("*", function (request, response) {
//     response.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
//   });
// }

app.use(express.static(path.resolve(__dirname, "./client/build")));

app.get("/api/v1", (req, res) => {
  res.send({ msg: "Welcome" });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticateUser, jobRoutes);

app.get("*", function (request, response) {
  response.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});

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
