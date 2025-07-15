import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./utils/connectDB.js";
import { router } from "./routes/userRoutes.js";
import { propertyRouter } from "./routes/propertyRoutes.js";
import { bookingRouter } from "./routes/bookingRouter.js";

dotenv.config();
const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.ORIGIN_ACCESS_URL,
    credentials: true,
  })
);
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use(cookieParser());
app.use(express.json());

const port = process.env.PORT || 8081;

// Database
connectDB();

// Routes
app.use("/api/v1/rent/user", router);
app.use("/api/v1/rent/listing", propertyRouter);
app.use("/api/v1/rent/user/booking", bookingRouter);

// Server
app.listen(port, () => {
  console.log(`App running on port: ${port}`);
});
