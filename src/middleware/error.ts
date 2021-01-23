import { NextFunction, Request, Response } from "express"
import { responseDetail } from "../config/responses"

type CustomError = {
  title: string
  status: number
  detail: string
  instance: string
}

export const ResponseError = (title: string, status = 500, url = "", detail = ""): CustomError => ({
  title,
  status,
  detail,
  instance: url,
})

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const response = {
    title: err.title || "Not Found",
    status: err.status || 500,
    instance: err.instance || req.originalUrl,
    detail: err.detail || responseDetail.unrecognised_url,
  }

  res.status(err.status).json(response)
}
