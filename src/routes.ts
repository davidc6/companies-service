import { Application, Response, Request } from "express"
import { getEnvBasedDomain } from "./utils/domain"
import { query } from "./db"

// temporary stub
export const tempCompaniesResponse = [
  { id: "slack", name: "Slack" },
  { id: "google", name: "Google" },
  { id: "ibm", name: "IBM" },
]

// temporary stub
export const tempCompanyData = {
  id: "ibm",
  name: "IBM",
  summary:
    "For more than a century IBM has been dedicated to every client's success and to creating innovations that matter for the world",
  careers: "https://www.ibm.com/employment/",
  industry: "technology",
  year_founded: 1911,
  github: "https://github.com/IBM",
  blog: "https://www.ibm.com/blogs/",
}

const mountRoutes = (app: Application): void => {
  app.get("/", async (req: Request, res: Response) => {
    const response = {
      all_companies_url: `${getEnvBasedDomain()}/companies`,
    }

    try {
      const dbResponse = await query("SELECT * FROM some_table")
      // dbResponse.rows - includes rows returned by the query
      // console.log(dbResponse)
    } catch (e) {
      console.log(e.message)
    }

    res.set({ Status: "200 OK" })
    res.status(200).json(response)
  })

  app.get("/companies", (req: Request, res: Response) => {
    res.set({ Status: "200 OK" })
    res.status(200).json(tempCompaniesResponse)
  })

  app.get("/companies/:id", (req: Request, res: Response) => {
    res.set({ Status: "200 OK" })
    res.status(200).json(tempCompanyData)
  })
}

export { mountRoutes }