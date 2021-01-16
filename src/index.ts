import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
// middleware
import { openApi } from './middleware/openapi'
import { handleError } from './middleware/error'
// modules
import { routes } from './routes'

dotenv.config()

const app = express()
app.disable('x-powered-by')

app.use(bodyParser.json())
app.use(bodyParser.text())
app.use(bodyParser.urlencoded({ extended: false, }))

openApi(app)
handleError(app)

routes(app)

export default app
