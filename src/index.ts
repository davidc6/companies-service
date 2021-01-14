import express from 'express'
import { routes } from './routes'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.disable('x-powered-by')

routes(app)

export default app
