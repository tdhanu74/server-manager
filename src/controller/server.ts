import express from "express";
import {
  fetchServers,
  fetchServer,
  createServer,
  startServer,
  stopServer,
  getServerLogs,
} from "@/service/server";
import { type Server } from "@/types";
import logger from "@/util/logger";
import { removeServer } from "@/repository/server";

const serverRoute = express.Router();

serverRoute.get("/", async (_req, res) => {
  try {
    const servers = fetchServers();
    res.status(200).send(servers);
  } catch (e: any) {
    logger.error(e);
    res.status(500).send(e.message);
  }
});

serverRoute.post("/", async (req, res) => {
  try {
    const server: Partial<Server> = req.body;
    const result = createServer(server);
    res.status(200).send(result);
  } catch (e: any) {
    logger.error(e);
    res.status(500).send(e.message);
  }
});

serverRoute.delete("/:id", async (req, res) => {
  try {
    const result = removeServer(req.params.id);
    res.status(200).send(result);
  } catch (e: any) {
    logger.error(e);
    res.status(500).send(e.message);
  }
});

serverRoute.get("/:id", async (req, res) => {
  try {
    const server = fetchServer(req.params.id);
    res.status(200).send(server);
  } catch (e: any) {
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
  } catch (e: any) {
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
  } catch (e: any) {
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
  } catch (e: any) {
    logger.error(e);
    if (e.code === "ERR_NOT_FOUND") {
      res.status(404).send(e.message);
    } else {
      res.status(500).send(e.message);
    }
  }
});

export default serverRoute;
