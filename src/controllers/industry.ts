import { Request, Response, NextFunction } from "express"
import * as errorResponsesConfig from "../config/errorResponsesConfig.json"
import IndustryService from "../services/industry"
import { buildError } from "../utils/customError"

class Industry {
  industryService: IndustryService = null

  constructor(industryService: IndustryService) {
    this.industryService = industryService
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const industries = await this.industryService.getAll()
      res.status(200).json(industries)
    } catch (err) {
      next(buildError(err, errorResponsesConfig.missing))
    }
  }
}

export default Industry
