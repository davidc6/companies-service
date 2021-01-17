import { Application, Response, Request } from "express"
import { getEnvBasedDomain } from "./utils/domain"

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
}

const routes = (app: Application): void => {
  app.get("/", (req: Request, res: Response) => {
    const response = {
      all_companies_url: `${getEnvBasedDomain()}/companies`,
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

export { routes }
