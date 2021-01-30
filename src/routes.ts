import { Application, Response, Request, NextFunction } from "express"
import { query } from "./db"
import { buildError } from "./utils/customError"
import { isAlphaNumeric } from "./utils/regex"
import { getEnvBasedDomain } from "./utils/domain"
import * as errorResponsesConfig from "./config/errorResponsesConfig.json"
import { checkSchema, validationResult } from "express-validator"

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
      const { rows } = await query(
        "SELECT company_id, name, summary, careers, industry, founded, github, blog FROM companies LIMIT 10"
      )
      res.status(200).json(rows)
    } catch (err) {
      next(buildError(err, errorResponsesConfig.noCompanies))
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
      } = await query(
        "SELECT company_id, name, summary, careers, industry, founded, github, blog FROM companies WHERE company_id = $1 LIMIT 1",
        [req.params.id]
      )

      if (rows.length) {
        res.status(200).json(rows[0])
      } else {
        const err = new Error(`Company with an id of ${req.params.id} does not exist.`)
        next(buildError(err, errorResponsesConfig.companyNotFound, 404))
      }
    } catch (err) {
      next(buildError(err, errorResponsesConfig.noCompanies))
    }
  })

  app.post(
    "/companies",
    checkSchema({
      name: {
        matches: {
          bail: true,
          options: [/^[a-zA-Z0-9 ]*$/, "g"],
          errorMessage: "format is incorrect",
        },
      },
      industry: {
        isAlpha: {
          bail: true,
          errorMessage: "should only contain letters",
        },
      },
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      const queryOne =
        "INSERT INTO companies (company_id, name, summary, careers, industry, founded, github, blog)"
      const queryTwo = "VALUES ($1, $2, $3, $4, $5, $6, $7, $8)"
      const queryThree =
        "RETURNING company_id, name, summary, careers, industry, founded, github, blog"
      // const queryFour = "WHERE company_id = $1"
      const q = `${queryOne} ${queryTwo} ${queryThree}`

      try {
        validationResult(req).throw()

        const { company_id, name, summary, careers, industry, founded, github, blog } = req.body
        const values = [company_id, name, summary, careers, industry, founded, github, blog]

        const data = await query(q, values)

        res
          .location(`${getEnvBasedDomain(req)}/companies/${data.rows[0].company_id}`)
          .status(201)
          .json({ ...data.rows[0] })
      } catch (err) {
        next(err)
      }
    }
  )
}

export { mountRoutes }
