import express from "express";
import {
  getServers,
  getServer,
  startServer,
  stopServer,
  getServerLogs,
} from "../service/server";
import logger from "../util/logger";

const serverRoute = express.Router();

serverRoute.get("/", async (_req, res) => {
  try {
    const servers = getServers();
    res.status(200).send(servers);
  } catch (e) {
    logger.error(e);
    res.status(500).send(e.message);
  }
});

serverRoute.get("/:id", async (req, res) => {
  try {
    const server = getServer(req.params.id);
    res.status(200).send(server);
  } catch (e) {
    logger.error(e);
    if (e.code === "ERR_NOT_FOUND") {
      res.status(404).send(e.message);
    } else {
      res.status(500).send(e.message);
    }
  }
});

serverRoute.post("/:id/start", async (req, res) => {
  try {
    startServer(req.params.id);
    res.status(200).send();
  } catch (e) {
    logger.error(e);
    if (e.code === "ERR_NOT_FOUND") {
      res.status(404).send(e.message);
    } else {
      res.status(500).send(e.message);
    }
  }
});

serverRoute.post("/:id/stop", async (req, res) => {
  try {
    stopServer(req.params.id);
    res.status(200).send();
  } catch (e) {
    logger.error(e);
    if (e.code === "ERR_NOT_FOUND") {
      res.status(404).send(e.message);
    } else {
      res.status(500).send(e.message);
    }
  }
});

serverRoute.get("/:id/logs", async (req, res) => {
  try {
    const logs = getServerLogs(req.params.id);
    res.status(200).send(logs);
  } catch (e) {
    logger.error(e);
    if (e.code === "ERR_NOT_FOUND") {
      res.status(404).send(e.message);
    } else {
      res.status(500).send(e.message);
    }
  }
});

export default serverRoute;
