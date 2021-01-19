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
app.use(loggerMiddleware)
app.use(openApiValidator)
app.use(errorHandler)

mountRoutes(app)

export default app
