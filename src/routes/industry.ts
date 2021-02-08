import { Application, Response, Request, NextFunction } from "express"
import Industry from "../controllers/industry"
import IndustryService from "../services/industry"

const mountIndustryRoutes = (app: Application): void => {
  app.get("/industries", async (req: Request, res: Response, next: NextFunction) => {
    const industry = new Industry(new IndustryService())
    industry.getAll(req, res, next)
  })
}

export default mountIndustryRoutes
