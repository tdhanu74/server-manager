import { Server } from "@/types";
import { NotFoundError } from "@/errors";
import logger from "@/util/logger";
import {
  getServers,
  getServer,
  addServer,
  getServerByName,
} from "@/repository/server";
import ServerDaemon from "@/servers/daemon";
import { v4 as uuidv4 } from "uuid";

const daemon = ServerDaemon.instance;

export const fetchServers = (): Partial<Server>[] => {
  return getServers();
};

export const fetchServer = (id: string): Partial<Server> => {
  const result = getServer(id);
  if (!result) {
    throw new NotFoundError(`Server with id ${id} not found`);
  }

  logger.child({ id: id }).info(`Resolving ${id} => Server ${result.name}`);

  return result;
};

export const createServer = (server: Partial<Server>) => {
  let result = getServerByName(server.name ?? "");
  if (!result) {
    server.id = uuidv4();
    result = addServer(server as Server);
  } else {
    logger
      .child({ id: result.id })
      .info(`Server ${server.name} already exists`);
  }
  return result;
};

export const startServer = (id: string) => {
  const result = getServer(id);
  if (!result) {
    throw new NotFoundError(`Server with id ${id} not found`);
  }
  logger.child({ id: id }).info(`Starting server ${result.name} -> ${id}`);
  daemon.runServer(result);
};

export const stopServer = (id: string) => {
  const result = getServer(id);
  if (!result) {
    throw new NotFoundError(`Server with id ${id} not found`);
  }
  logger.child({ id: id }).info(`Starting server ${result.name} -> ${id}`);
  daemon.stopServer(result);
};

export const getServerLogs = (id: string): string[] => {
  const result = getServer(id);
  if (!result) {
    throw new NotFoundError(`Server with id ${id} not found`);
  }

  const logs = daemon.getLogs(result);

  logger.child({ id: id }).info(`Fetching Server ${id} Logs`);

  return logs.map((log) => log.log);
};
