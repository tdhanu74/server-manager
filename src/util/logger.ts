import winston from "winston";
const { combine, json, timestamp, colorize, align, printf, errors } =
  winston.format;

const logger = winston.createLogger({
  defaultMeta: {
    service: "server-manager",
  },
  transports: [
    new winston.transports.Console({
      level: process.env.CONSOLE_LOG_LEVEL || "info",
      format: combine(
        timestamp({
          format: "YYYY-MM-DD hh:mm:ss.SSS A", // 2026-01-22 03:23:10.350 PM
        }),
        errors({ stackTrace: true }),
        colorize({ all: true }),
        align(),
        printf(
          (info) => `[${info.level}] ${info.timestamp} => ${info.message}`,
        ),
      ),
    }),
    new winston.transports.File({
      filename: "file.log",
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

export default logger;
