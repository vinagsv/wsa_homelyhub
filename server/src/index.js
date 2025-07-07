import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./utils/connectDB.js";
import { router } from "./routes/userRoutes.js";
import { propertyRouter } from "./routes/propertyRoutes.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 8081;

// Middleware
app.use(
  cors({
    origin: process.env.ORIGIN_ACCESS_URL, // corrected spelling
    credentials: true,
  })
);
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());
app.use(express.json());

// Database
connectDB();

// Routes
app.use("/api/v1/rent/user", router);
app.use("/api/v1/rent/listing", propertyRouter);

// Server
app.listen(port, () => {
  console.log(`App running on port: ${port}`);
});
