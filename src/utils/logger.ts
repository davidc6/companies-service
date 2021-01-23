import winston from "winston"

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "companies-service" },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({
          format: "YYYY-MM-DD HH:mm:ss.sssZ",
        }),
        winston.format.printf(
          ({ level, message, timestamp }) => `[${level}] - ${timestamp} ${message}`
        )
      ),
    }),
  ],
  levels: winston.config.npm.levels,
})

export { logger }
