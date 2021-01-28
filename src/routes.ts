import { Application, Response, Request, NextFunction } from "express"
import { query } from "./db"
import { CustomError } from "./utils/customError"
import { isAlphaNumeric } from "./utils/regex"
import { getEnvBasedDomain } from "./utils/domain"
import * as errorResponsesConfig from "./config/errorResponsesConfig.json"

const mountRoutes = (app: Application): void => {
  const buildError = (e, config, status = 500) => {
    const error = new CustomError(e)
    error.title = config?.title
    error.detail = config?.detail
    error.status = status
    return error
  }

  app.get("/", (req: Request, res: Response) => {
    const response = {
      current_url: getEnvBasedDomain(req),
      all_companies_url: `${getEnvBasedDomain(req)}/companies`,
      company_url: `${getEnvBasedDomain(req)}/companies/{company_id}`,
    }

    res.status(200).json(response)
  })

  app.get("/companies", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { rows } = await query("SELECT company_id, name FROM companies LIMIT 10")
      res.status(200).json(rows)
    } catch (e) {
      next(buildError(e, errorResponsesConfig.noCompanies))
    }
  })

  app.get("/companies/:id", async (req: Request, res: Response, next) => {
    if (!isAlphaNumeric(req.params.id)) {
      const e = new Error("Company :id is invalid")
      return next(buildError(e, errorResponsesConfig.invalidCompanyId, 400))
    }

    try {
      const {
        rows,
      } = await query("SELECT company_id, name FROM companies WHERE company_id = $1 LIMIT 1", [
        req.params.id,
      ])

      if (rows.length) {
        res.status(200).json(rows[0])
      } else {
        const e = new Error(`Company with an id of ${req.params.id} does not exist.`)
        next(buildError(e, errorResponsesConfig.companyNotFound, 404))
      }
    } catch (e) {
      next(buildError(e, errorResponsesConfig.noCompanies))
    }
  })
}

export { mountRoutes }
