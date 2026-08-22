import db from "@/util/db/client";
import { type Server } from "@/types";

const INSERT_QUERY =
  "INSERT INTO server (id, name, type, entrypoint) VALUES(@id, @name, @type, @entrypoint) RETURNING *";
const SERVERS_QUERY = "SELECT * FROM server";
const SERVER_QUERY = "SELECT * FROM server WHERE id = ?";
const SERVER_BY_NAME_QUERY = "SELECT * FROM server WHERE name = ?";
const DELETE_QUERY = "DELETE FROM server WHERE id = ?";

export function getServers(): Server[] {
  const serversStmt = db.prepare(SERVERS_QUERY);
  const servers = serversStmt.all();
  return servers as Server[];
}

export function getServer(id: string): Server {
  const serverStmt = db.prepare(SERVER_QUERY);
  const server = serverStmt.get(id);
  return server as Server;
}

export function getServerByName(name: string): Server {
  const serverStmt = db.prepare(SERVER_BY_NAME_QUERY);
  const server = serverStmt.get(name);
  return server as Server;
}

export function addServer(server: Server): Server {
  const insertStmt = db.prepare(INSERT_QUERY);
  const insert = db.transaction((server): Server => {
    return insertStmt.get(server) as Server;
  });
  return insert(server);
}

export function addServers(servers: Server[]) {
  const insertStmt = db.prepare(INSERT_QUERY);
  const insert = db.transaction((servers) => {
    for (const server of servers) {
      insertStmt.run(server);
    }
  });
  insert(servers);
}

export function removeServer(id: string) {
  const deleteStmt = db.prepare(DELETE_QUERY);
  const remove = db.transaction((id) => {
    deleteStmt.run(id);
  });
  remove(id);
}
