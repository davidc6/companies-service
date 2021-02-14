import rateLimit from "express-rate-limit"
import { CustomError } from "../utils/customError"
import * as errorResponsesConfig from "../config/errorResponsesConfig.json"

const rateLimiter = (opts): rateLimit.RateLimit => {
  const combined = {
    handler: (req, res, next) => {
      const e = new Error(errorResponsesConfig.requestLimit.title)
      const err = new CustomError(e)
      err.status = 429
      err.detail = errorResponsesConfig.requestLimit.detail

      next(err)
    },
    ...opts,
  }

  return rateLimit(combined)
}

export { rateLimiter }
