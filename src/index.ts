import express from "express"
import "dotenv/config"
import bodyParser from "body-parser"
import cors from "cors"
import helmet from "helmet"
import { openApiValidator } from "./middleware/openapi"
import { errorHandler } from "./middleware/errorHandler"
import { loggerMiddleware } from "./middleware/logger"
import { rateLimiter } from "./middleware/rateLimit"
import { mountRoutes } from "./routes"
import mountIndustryRoutes from "./routes/industry"

const app = express()
app.disable("x-powered-by")
app.use(helmet())
app.use(bodyParser.json())
app.use(bodyParser.text())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())
app.use(
  rateLimiter({
    windowMs: 60 * 60 * 1000,
    max: 50,
  })
)

// do not use logger when running tests
if (process.env.SUPPRESS_LOGS === "false") {
  app.use(loggerMiddleware)
}

// validate schema next
app.use(openApiValidator)

mountRoutes(app)
mountIndustryRoutes(app)

// error handling middleware should come last
// ref: https://expressjs.com/en/guide/error-handling.html
app.use(errorHandler)

export default app
