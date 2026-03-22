import { spawn } from "child_process";
import { v4 as uuidv4 } from "uuid";
import { AlreadyRunningError, NotRunningError } from "../errors";
import SSE from "../util/event-emitter";
import winston from "winston";
import * as path from "path";
import fs from "node:fs";

const { combine, json, timestamp, errors } = winston.format;

export default class MinecraftServer {
  public constructor(entrypoint: string, maxlimit: number, name: string) {
    this.id = uuidv4();
    this.name = name;
    this.logs = [];
    this.entrypoint = entrypoint;
    this.maxlimit = maxlimit;
    this.allowInput = false;
    this.running = false;
    this.instance = null;
    this.logLocation = null;
  }
  run() {
    if (!this.running) {
      this.logLocation = `logs/minecraft/${this.name}/${new Date().toISOString()}.log`;
      this.logs = [];

      if (path.extname(this.entrypoint) === ".jar") {
        this.instance = spawn(
          "java",
          [
            `-Xmx${this.maxlimit}G`,
            "-jar",
            path.basename(this.entrypoint),
            "nogui",
          ],
          {
            cwd: path.dirname(this.entrypoint),
          },
        );
      } else {
        this.instance = spawn(`./${path.basename(this.entrypoint)}`, [], {
          cwd: path.dirname(this.entrypoint),
        });
      }

      this.logger = winston.createLogger({
        transports: [
          new winston.transports.File({
            filename: this.logLocation,
            level: process.env.FILE_LOG_LEVEL || "debug",
            format: combine(
              timestamp({
                format: "YYYY-MM-DD hh:mm:ss.SSS A", // 2026-01-22 03:23:10.350 PM
              }),
              errors({ stackTrace: true }),
              json(),
            ),
          }),
        ],
      });

      this.instance.stdout.setEncoding("utf-8");
      this.instance.stdout.on("data", (data) => {
        this.logger.info(data);
        this.logs.push(data);
        SSE.emit("server-log", {
          id: this.id,
          log: data,
        });
        if (data.includes('For help, type "help"')) {
          this.allowInput = true;
        }
      });

      this.instance.stderr.setEncoding("utf-8");
      this.instance.stderr.on("data", (error) => {
        this.logger.error(error);
      });

      this.instance.on("exit", (code, signal) => {
        this.running = false;
        this.allowInput = false;

        SSE.emit("server-update", {
          id: this.id,
          running: false,
        });
      });

      this.running = true;

      SSE.emit("server-update", {
        id: this.id,
        running: true,
      });
    } else {
      throw new AlreadyRunningError(
        `Instance already running for server -- ${this.name}`,
      );
    }
  }
  interact(input: string) {
    if (this.running) {
      this.instance.stdin.write(`${input}\n`);
    } else {
      throw new NotRunningError(
        `Instance is not running for server -- ${this.name}`,
      );
    }
  }
  stop() {
    if (this.running) {
      this.instance.stdin.write("stop\n");
    }
  }
  forceStop() {
    if (this.running) {
      this.instance.kill("SIGINT");
    }
  }
  getLogs() {
    return this.logs;
  }
}
