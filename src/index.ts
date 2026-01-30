import express from "express";
import { rateLimit } from "express-rate-limit";
import dotenv from "dotenv";
import logger from "./util/logger";

const app = express();
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 20,
  legacyHeaders: false,
  standardHeaders: "draft-8",
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);

app.listen(process.env.PORT, () => {
  logger.info("Starting on port:", process.env.PORT);
});

process.on("exit", () => {});
