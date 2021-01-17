import * as OpenApiValidator from "express-openapi-validator"
import path from "path"

export const openApiValidator = OpenApiValidator.middleware({
  apiSpec: `${path.join(__dirname, "openapi.yml")}`,
  validateRequests: true,
  validateResponses: true,
})
