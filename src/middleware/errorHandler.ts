import { NextFunction, Request, Response } from "express"
import { logger } from "../utils/logger"
import { CustomError } from "../utils/customError"

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const response = {
    title: err.title || err.message,
    status: err.status || 500,
    instance: req.originalUrl,
    detail: err.detail || err.message,
  }

  // suppress logging when running tests
  if (process.env.SUPPRESS_LOGS === "false") {
    const logMessage = `[${req.method}] - ${req.url} - ${response.status} - ${err.stack}`
    logger.log({ level: "error", message: logMessage })
  }

  res.status(response.status).json(response)
}
