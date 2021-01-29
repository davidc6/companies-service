import { NextFunction, Request, Response } from "express"
import { CustomError } from "../utils/customError"
import "dotenv/config"

export const apiKeyValidator = (req: Request, res: Response, next: NextFunction): void => {
  if (req.path === "/") {
    return next()
  }

  const apiKeys = process.env.API_KEYS || ""
  const apiKeysSet = new Set(apiKeys.split(","))
  const requestApiKey = req.header("x-api-key")

  if (!apiKeysSet.has(requestApiKey)) {
    const e = new Error("No valid API key was provided")
    const error = new CustomError(e)
    error.status = 401
    error.detail = "Please supply a valid API key or sign up to get one issued to you."
    error.title = "Unauthorized request"

    return next(error)
  }

  next()
}
