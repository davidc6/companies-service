import express from "express"
import dotenv from "dotenv"
import bodyParser from "body-parser"
// middleware
import { openApiValidator } from "./middleware/openapi"
import { errorHandler } from "./middleware/error"
import { loggerMiddleware } from "./middleware/logger"
// modules
import { routes } from "./routes"

dotenv.config()

const app = express()
app.disable("x-powered-by")

app.use(bodyParser.json())
app.use(bodyParser.text())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(loggerMiddleware)
app.use(openApiValidator)
app.use(errorHandler)

routes(app)

export default app
