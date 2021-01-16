import { Application, Response, Request } from 'express'
import { getEnvBasedDomain } from './utils/domain'

// temporary stub
export const tempCompaniesResponse = [
  {"id": "slack", "name": "Slack",},
  {"id": "google", "name": "Google",},
  {"id": "ibm", "name": "IBM",},
]

const routes = (app: Application) => {
  app.get('/', (req: Request, res: Response) => {  
    const response = {
      "all_companies_url": `${getEnvBasedDomain()}/companies`,
    }
  
    res.set({'Status': '200 OK',})
    res.status(200).json(response)
  })
  
  app.get('/companies', (req: Request, res: Response) => {
    res.set({'Status': '200 OK',})
    res.status(200).json(tempCompaniesResponse)
  })
}

export { routes }
