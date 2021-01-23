import express from "express"
import dotenv from "dotenv"
import bodyParser from "body-parser"
import cors from "cors"
import helmet from "helmet"
import { openApiValidator } from "./middleware/openapi"
import { errorHandler } from "./middleware/error"
import { loggerMiddleware } from "./middleware/logger"
import { mountRoutes } from "./routes"

dotenv.config()

const app = express()
app.disable("x-powered-by")

app.use(helmet())
app.use(bodyParser.json())
app.use(bodyParser.text())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())
// do not use logger when running tests
if (!process.env.TESTS) {
  app.use(loggerMiddleware)
}
app.use(openApiValidator)

mountRoutes(app)

// error handling middleware should come
// ref: https://expressjs.com/en/guide/error-handling.html
app.use(errorHandler)

export default app
