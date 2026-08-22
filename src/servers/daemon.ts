import { builder } from "@/servers/builder";
import { ServerInstance } from "@/servers/base";
import { type Server } from "@/types";
import { NotRunningError } from "@/errors";

export default class ServerDaemon {
  serverInstances: {
    [key: string]: ServerInstance;
  } = {};
  static daemon: ServerDaemon;

  private constructor() {}

  public static get instance(): ServerDaemon {
    if (!ServerDaemon.daemon) {
      ServerDaemon.daemon = new ServerDaemon();
    }

    return ServerDaemon.daemon;
  }

  public runServer(server: Server) {
    if (this.serverInstances[server.id]) {
      this.serverInstances[server.id].start();
    } else {
      this.serverInstances[server.id] = builder(server);
      this.serverInstances[server.id].start();
    }
  }

  public stopServer(server: Server) {
    if (this.serverInstances[server.id]) {
      this.serverInstances[server.id].stop();
    } else {
      throw new NotRunningError(`Server ${server.name} is not running`);
    }
  }

  public getLogs(server: Server) {
    if (this.serverInstances[server.id]) {
      return this.serverInstances[server.id].getLogs();
    } else {
      throw new NotRunningError(`Server ${server.name} is not running`);
    }
  }
}
