import { Application, Response, Request, NextFunction } from "express"
import { getEnvBasedDomain } from "./utils/domain"
import { query } from "./db"
import { ResponseError } from "./middleware/error"
import { responseDetail, responseTitle } from "./config/responses"

const mountRoutes = (app: Application): void => {
  app.get("/", async (req: Request, res: Response) => {
    const response = {
      current_url: `${getEnvBasedDomain()}`,
      all_companies_url: `${getEnvBasedDomain()}/companies`,
      company_url: `${getEnvBasedDomain()}/companies/{company_id}`,
    }

    res.status(200).json(response)
  })

  app.get("/companies", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { rows } = await query("SELECT company_id, name FROM companies")
      res.status(200).json(rows)
    } catch (e) {
      next(ResponseError(responseTitle.errorDB, 500, req.originalUrl, responseDetail.errorDB))
    }
  })

  app.get("/companies/:id", async (req: Request, res: Response, next) => {
    const regex = /^[a-z-]+$/
    const re = new RegExp(regex)

    if (!re.test(req.params.id)) {
      return next(
        ResponseError("Bad Request", 400, req.originalUrl, responseDetail.unrecognisedUrl)
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
        next(ResponseError("Not Found", 404, req.originalUrl, responseDetail.notFoundInDB))
      }
    } catch (e) {
      next(ResponseError("Internal Server Error", 500, req.originalUrl, responseDetail.errorDB))
    }
  })
}

export { mountRoutes }
