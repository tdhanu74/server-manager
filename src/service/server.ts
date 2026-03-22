import { builder } from "../servers/builder";
import { Server } from "../types";
import { NotFoundError } from "../errors";
import logger from "../util/logger";

export const serverInstances = {};

export const servers = [
  {
    name: "vault-hunter",
    type: "minecraft",
    maxlimit: 4,
    entrypoint: "/home/whynot/minecraft-servers/vault-hunter/run.sh",
  },
  {
    name: "palworld",
    type: "palworld",
    entrypoint: "/home/whynot/palworld-servers/retarded-pokemons/PalServer.sh",
  },
  {
    name: "local",
    type: "minecraft",
    maxlimit: 4,
    entrypoint: "/home/flip/minecraft/server.jar",
  },
  {
    name: "vh-local",
    type: "minecraft",
    maxlimit: 4,
    entrypoint: "/home/flip/vault-hunter/run.sh",
  },
] as Server[];

servers?.map((server: Server) => {
  const serverInstance = builder(server);
  serverInstances[serverInstance.id] = serverInstance;
  server.id = serverInstance.id;
  server.running = serverInstance.running;
});

export const getServers = (): Partial<Server>[] => {
  return servers.map((server: Server) => {
    return {
      id: server.id,
      name: server.name,
      type: server.type,
      running: serverInstances[server.id].running,
    };
  });
};

export const getServer = (id: string): Partial<Server> => {
  const result = servers.filter((server: Server) => {
    return server.id === id;
  })[0];
  if (!result) {
    throw new NotFoundError(`Server with id ${id} not found`);
  }

  logger.child({ id: id }).info(`Resolving ${id} => Server ${result.name}`);

  return {
    id: result.id,
    name: result.name,
    type: result.type,
    running: serverInstances[result.id].running,
  };
};

export const startServer = (id: str) => {
  if (!Object.keys(serverInstances).includes(id)) {
    throw new NotFoundError(`Server with id ${id} not found`);
  }
  logger
    .child({ id: id })
    .info(`Starting server ${serverInstances[id].name} -> ${id}`);
  serverInstances[id].run();
};

export const stopServer = (id: str) => {
  if (!Object.keys(serverInstances).includes(id)) {
    throw new NotFoundError(`Server with id ${id} not found`);
  }
  logger
    .child({ id: id })
    .info(`Stopping server ${serverInstances[id].name} -> ${id}`);
  serverInstances[id].stop();
};

export const getServerLogs = (id: string): string[] => {
  if (!Object.keys(serverInstances).includes(id)) {
    throw new NotFoundError(`Server with id ${id} not found`);
  }

  const logs = serverInstances[id].getLogs();

  logger.child({ id: id }).info(`Fetching Server ${id} Logs`);

  return logs;
};
