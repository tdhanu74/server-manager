import { spawn } from "child_process";
import { v4 as uuidv4 } from "uuid";
import { AlreadyRunningError, NotRunningError } from "../errors";
import winston from "winston";

const { combine, json, timestamp, errors } = winston.format;

class MinecraftServer {
  public constructor(entrypoint: string, maxlimit: number, name: string) {
    this.id = uuidv4();
    this.name = name;
    this.entrypoint = entrypoint;
    this.maxlimit = maxlimit;
    this.allowInput = false;
    this.running = false;
    this.instance = null;
    this.logger = winston.createLogger({
      transports: [
        new winston.transports.File({
          filename: `minecraft-${this.name}-${this.id}-${new Date()}.log`,
          level: process.env.FILE_LOG_LEVEL || "debug",
          format: combine(
            errors({ stackTrace: true }),
            json(),
            timestamp({
              format: "YYYY-MM-DD hh:mm:ss.SSS A", // 2026-01-22 03:23:10.350 PM
            }),
          ),
        }),
      ],
    });
  }
  run() {
    if (!this.running) {
      if (path.extname(this.entrypoint) === ".jar") {
        this.instance = spawn(
          "java",
          [
            `-Xmx${this.maxlimit}G`,
            "-jar",
            path.filename(this.entrypoint),
            "nogui",
          ],
          {
            cwd: path.dirname(this.entrypoint),
          },
        );
      } else {
        this.instance = spawn(path.filename(this.entrypoint), [], {
          cwd: path.dirname(this.entrypoint),
        });
      }

      this.instance.stdout.setEncoding("utf-8");
      this.instance.stdout.on("data", (data) => {
        this.logger.info(data);
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
      });

      this.running = true;
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
    this.instance.stdin.write("stop\n");
  }
}
