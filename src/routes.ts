import { Application, Response, Request, NextFunction } from "express"
import { getEnvBasedDomain } from "./utils/domain"
import { query } from "./db"
import { ResponseError } from "./utils/error"
import { responseDetail, responseTitle } from "./config/responses"
import { isAlphaNumeric } from "./utils/regex"

const mountRoutes = (app: Application): void => {
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
      next(ResponseError(responseTitle.errorDB, 500, req.originalUrl, responseDetail.errorDB, e))
    }
  })

  app.get("/companies/:id", async (req: Request, res: Response, next) => {
    if (!isAlphaNumeric(req.params.id)) {
      const e = new Error("Company :id is invalid")
      return next(
        ResponseError("Bad Request", 400, req.originalUrl, responseDetail.unrecognisedUrl, e)
      )
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
        next(ResponseError("Not Found", 404, req.originalUrl, responseDetail.notFoundInDB, e))
      }
    } catch (e) {
      next(ResponseError("Internal Server Error", 500, req.originalUrl, responseDetail.errorDB, e))
    }
  })
}

export { mountRoutes }
