import e, { NextFunction, Request, Response } from "express"
import { responseDetail } from "../config/responses"
import { logger } from "../utils/logger"
import { ResponseErrorType } from "../utils/error"

export const errorHandler = (
  err: ResponseErrorType,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const response = {
    title: err.title || "Not Found",
    status: err.status || 500,
    instance: err.instance || req.originalUrl,
    detail: err.detail || responseDetail.unrecognisedUrl,
  }

  // suppress logging when running tests
  if (!process.env.TESTS) {
    const stack = err?.e?.stack ? err.e.stack : err.stack
    const logMessage = `${response.status} - [${req.method}] - ${req.url} - ${stack}`
    logger.log({ level: "error", message: logMessage })
  }

  res.status(err.status).json(response)
}
