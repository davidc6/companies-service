import { Application, Response, Request } from "express"
import { getEnvBasedDomain } from "./utils/domain"
import { query } from "./db"

const mountRoutes = (app: Application): void => {
  app.get("/", async (req: Request, res: Response) => {
    const response = {
      all_companies_url: `${getEnvBasedDomain()}/companies`,
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

  app.get("/companies/:id", async (req: Request, res: Response) => {
    const regex = /^[a-z-]+$/
    const re = new RegExp(regex)

    if (!re.test(req.params.id)) {
      res.set({ Status: "500 Internal Server Error" })
      res.status(500).json({ message: "Sorry, something went wrong." })
      return
    }

    try {
      const {
        rows,
      } = await query("SELECT company_id, name FROM companies WHERE company_id = $1 LIMIT 1", [
        req.params.id,
      ])

      res.set({ Status: "200 OK" })
      res.status(200).json(rows[0])
    } catch (e) {
      res.set({ Status: "500 Internal Server Error" })
      res.status(500).json({ message: "Sorry, something went wrong." })
    }
  })
}

export { mountRoutes }
