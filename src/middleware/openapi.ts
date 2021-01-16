import * as OpenApiValidator from 'express-openapi-validator'
import path from 'path'

const openApi = (app) => {  
  app.use(OpenApiValidator.middleware({
    apiSpec: `${path.join(__dirname, 'openapi.yml')}`,
    validateRequests: true,
    validateResponses: true,
  }))                     
}

export { openApi }
