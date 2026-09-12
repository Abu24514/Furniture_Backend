import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";

import { errorHandler, notFoundHandler } from "./middlewares/error.middleware.js";
import apiRoutes from "./routes/index.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
app.use(compression());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "OK" });
});

app.use("/api", apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;