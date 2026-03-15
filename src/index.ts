import "dotenv/config";
import express from "express";
import { rateLimit } from "express-rate-limit";
import logger from "./util/logger";
import serverRoute from "./controller/server";
import { servers, serverInstances } from "./service/server";

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

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  next();
});

app.use("/server", serverRoute);

const instance = app.listen(process.env.PORT, () => {
  logger.info("Starting on port:", process.env.PORT);
});

process.on("SIGINT", () => {
  servers.forEach((server) => {
    serverInstances[server.id].stop();
  });
  instance.close();
});

process.on("exit", () => {
  servers.forEach((server) => {
    serverInstances[server.id].stop();
  });
});
