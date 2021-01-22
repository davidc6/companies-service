import { Application, Response, Request, response } from "express"
import { getEnvBasedDomain } from "./utils/domain"
import { query } from "./db"
import { ResponseError } from "./middleware/error"
import { responseText } from "./config/responses"

const mountRoutes = (app: Application): void => {
  app.get("/", async (req: Request, res: Response) => {
    const response = {
      current_url: `${getEnvBasedDomain()}`,
      all_companies_url: `${getEnvBasedDomain()}/companies`,
      company_url: `${getEnvBasedDomain()}/companies/{company_id}`,
    }

    try {
      res.set({ Status: "200 OK" })
      res.status(200).json(response)
    } catch (e) {
      res.set({ Status: "500 Internal Server Error" })
      res.status(500).json({ message: "Sorry, something went wrong." })
    }
  })

  app.get("/companies", async (req: Request, res: Response) => {
    try {
      const { rows } = await query("SELECT company_id, name FROM companies")

      res.set({ Status: "200 OK" })
      res.status(200).json(rows)
    } catch (e) {
      res.set({ Status: "500 Internal Server Error" })
      res.status(500).json({ message: "Sorry, something went wrong." })
    }
  })

  app.get("/companies/:id", async (req: Request, res: Response, next) => {
    const regex = /^[a-z-]+$/
    const re = new RegExp(regex)

    if (!re.test(req.params.id)) {
      return next(ResponseError("Bad Request", 400, req.originalUrl, responseText.unrecognised_url))
    }

    try {
      const {
        rows,
      } = await query("SELECT company_id, name FROM companies WHERE company_id = $1 LIMIT 1", [
        req.params.id,
      ])

      if (rows.length) {
        res.set({ Status: "200 OK" })
        res.status(200).json(rows[0])
      } else {
        next(ResponseError("Not Found", 404, req.originalUrl, responseText.not_found_db))
      }
    } catch (e) {
      next(
        ResponseError("Internal Server Error", 500, req.originalUrl, "Sorry, something went wrong")
      )
    }
  })
}

export { mountRoutes }
