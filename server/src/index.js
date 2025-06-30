import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./utils/connectDB.js";
import { router } from "./routes/userRoutes.js";
import { propertyRouter } from "./routes/propertyRouter.js";

dotenv.config();
const app = express();
app.use(cors({ origin: process.env.ORIGIN_ACCESS_URL, credentials: true }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());
app.use(express.json());
const port = process.env.PORT || 8081;

//Run database
connectDB();

//Run Routes
app.use("/api/v1/rent/user", router);
app.use("/api/v1/rent/listing", propertyRouter);

//Connection
app.listen(port, () => {
  console.log(`App running on port: ${port}`);
});
