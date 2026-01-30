import winston from "winston";
const { combine, json, timestamp, colorize, align, printf, errors } =
  winston.format;

const logger = winston.createLogger({
  defaultMeta: {
    service: "url-shortner",
  },
  transports: [
    new winston.transports.Console({
      level: process.env.CONSOLE_LOG_LEVEL || "info",
      format: combine(
        errors({ stackTrace: true }),
        colorize({ all: true }),
        json(),
        timestamp({
          format: "YYYY-MM-DD hh:mm:ss.SSS A", // 2026-01-22 03:23:10.350 PM
        }),
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
        errors({ stackTrace: true }),
        json(),
        timestamp({
          format: "YYYY-MM-DD hh:mm:ss.SSS A", // 2026-01-22 03:23:10.350 PM
        }),
      ),
    }),
  ],
});

export default logger;
