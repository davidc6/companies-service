import { Application } from 'express';
import { getEnvBasedDomain } from './utils/domain'

const routes = (app: Application) => {
  app.get('/', (req, res) => {  
    const response = {
      "all_companies_url": `${getEnvBasedDomain()}/companies`
    }
  
    res.set({'Status': '200 OK'})
    res.status(200).json(response)
  })
  
  app.get('/companies', (req, res) => {
    // stub
    const response = [
      {"id": "slack", "name": "Slack"},
      {"id": "google", "name": "Google"},
      {"id": "ibm", "name": "IBM"}
    ]
  
    res.set({'Status': '200 OK'})
    res.status(200).json(response)
  })
}

export { routes }
