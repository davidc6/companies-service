import { NextFunction, Request, Response } from "express"
import { responseText } from "../config/responses"

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
    detail: err.detail || responseText.unrecognised_url,
  }

  res.set({ Status: `${response.status} ${response.title}` })
  res.status(err.status).json(response)
}
