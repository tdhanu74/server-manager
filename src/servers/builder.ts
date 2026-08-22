import { MinecraftServer } from "./minecraft";
import { PalworldServer } from "./palworld";
import { Server } from "@/types";
import { NotFoundError } from "@/errors";
import { ServerInstance } from "./base";

export const builder = (server: Server): ServerInstance => {
  switch (server.type) {
    case "minecraft":
      return new MinecraftServer(
        server.id,
        server.entrypoint,
        server.maxlimit ?? 4,
        server.name,
      );
    case "palworld":
      return new PalworldServer(server.id, server.entrypoint, server.name);
  }
  throw new NotFoundError(`No server with type ${server.type} found`);
};
