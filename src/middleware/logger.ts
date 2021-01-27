import { NextFunction, Request, Response } from "express"
import { logger } from "../utils/logger"

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const logMessage = `${req.method} - ${req.url}`

  logger.log({ level: "info", message: logMessage })
  next()
}
