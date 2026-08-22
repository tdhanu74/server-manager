import db from "./client";
import fs from "node:fs";
import logger from "@/util/logger";

export function init() {
  const migrations: string[] = [];
  let version = db.pragma("user_version", {
    simple: true,
  }) as number;

  logger.info(`Database Migration Version => ${version}`);

  fs.readdir("./migrations", (err, filenames) => {
    if (err) {
      logger.error(err);
    }

    filenames.forEach((file) => {
      migrations.push(`./migrations/${file}`);
    });

    while (version < migrations.length) {
      fs.readFile(migrations[version], "utf-8", (err, data) => {
        if (err) {
          logger.error(err);
        }
        db.exec(data);
      });
      version++;
    }
  });
}
