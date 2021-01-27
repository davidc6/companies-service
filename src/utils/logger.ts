import winston from "winston"

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss.sssZ",
    }),
    winston.format.printf(
      ({ level, message, timestamp }) => `[${level}] - ${timestamp} - ${message}`
    )
  ),
  transports: [new winston.transports.Console()],
})

export { logger }
