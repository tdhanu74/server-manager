import "dotenv/config";
import express from "express";
import { rateLimit } from "express-rate-limit";
import logger from "./util/logger";
import serverRoute from "./controller/server";
import SSE from "./util/event-emitter";

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

app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  next();
});

app.use("/server", serverRoute);

app.get("/events", (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  req.on("close", () => {
    res.end();
  });

  SSE.on("server-update", (server) => {
    res.write(
      `id: ${server.id}\nevent: update\ndata: ${JSON.stringify({ id: server.server_id, running: server.running })}\n\n`,
    );
  });

  SSE.on("server-log", (server) => {
    res.write(
      `id: ${server.id}\nevent: log\ndata: ${JSON.stringify({ id: server.server_id, log: server.log })}\n\n`,
    );
  });
});

app.listen(process.env.PORT, () => {
  logger.info("Starting on port:", process.env.PORT);
});
