import { NextFunction, Request, Response } from "express"
import { logger } from "../utils/logger"
import { CustomError } from "../utils/customError"
import * as errorResponsesConfig from "../config/errorResponsesConfig.json"

type OpenApiErrors = {
  path: string
  message: string
  errorCode: string
}

type OpenApiError = {
  message: string
  errors: OpenApiErrors[]
}

type ExpressErrors = {
  param: string
  msg: string
}

type ExpressValidatorError = {
  throw: () => void
  errors: ExpressErrors[]
}

export const errorHandler = (
  err: CustomError & OpenApiError & ExpressValidatorError, // intersection type here since we can get different types
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // express-validator errors come in a different format
  // we want to transform these
  // express-validator has "throw" key which we can check for to make sure the errors come from it
  if (err.errors && err.hasOwnProperty("throw")) {
    const { msg, param } = err.errors[0]

    err.status = 400
    err.title = `'${param}' field ${msg}`
    err.detail = `Looks like '${param}' field ${msg}`
  }

  // express-openapi-validator errors come in a different type - OpenApiFormat
  // we want to transform these
  // let's check if it is an openapi-validator-error but doing the inverted check
  if (err.errors && !err.hasOwnProperty("throw")) {
    // get the first error since we get an array of all errors
    // we don't want to send a massive error payload back
    const firstError = err.errors[0]

    // we need to know whether it's a required property error
    // or type of data is incorrect
    // the format of usually - .body.field (we need to get "field")
    const fields = firstError.path.split(".")
    const fieldName = fields[fields.length - 1]

    // check if error message already includes field name
    // if it does then it probably means that it's a data type error
    if (fields.length > 1 && firstError.message.includes(fieldName)) {
      err.title = `${firstError.message[0].toUpperCase()}${firstError.message.slice(
        1,
        firstError.message.length
      )}`
      err.detail = `Looks like your request ${firstError.message}`
    } else if (fields.length > 1) {
      // pretty format field error
      err.title = `'${fieldName}' field ${firstError.message}`
      err.detail = `Looks like '${fieldName}' field ${firstError.message}`
    } else {
      // invalid url
      err.title = `Url ${firstError.message}`
      err.detail = errorResponsesConfig.invalidCompanyId.detail
    }
  }

  const response = {
    title: err.title || err.message,
    status: err.status || 500,
    instance: req.originalUrl,
    detail: err.detail || err.message,
  }

  if (process.env.SUPPRESS_LOGS === "false") {
    const logMessage = `[${req.method}] - ${req.url} - ${response.status} - ${err.stack}`
    logger.log({ level: "error", message: logMessage })
  }

  res.status(response.status).json(response)
}
