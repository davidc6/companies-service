import { Request, Response, NextFunction } from "express"
import * as errorResponsesConfig from "../config/errorResponsesConfig.json"
import { isAlphaNumeric } from "../utils/regex"
import CompanyService from "../services/company"
import { buildError } from "../utils/customError"
import { getEnvBasedDomain } from "../utils/domain"

class Company {
  companyService: CompanyService = null

  constructor(companyService: CompanyService) {
    this.companyService = companyService
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const companies = await this.companyService.getAll()
      res.status(200).json(companies)
    } catch (err) {
      next(buildError(err, errorResponsesConfig.noCompanies))
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id

      if (!isAlphaNumeric(id)) {
        const e = new Error("Company :id is invalid")
        return next(buildError(e, errorResponsesConfig.invalidCompanyId, 400))
      }

      const company = await this.companyService.getById(id)

      if (company) {
        res.status(200).json(company)
      } else {
        const err = new Error(`Company with an id of ${id} does not exist.`)
        next(buildError(err, errorResponsesConfig.companyNotFound, 404))
      }
    } catch (err) {
      next(buildError(err, errorResponsesConfig.noCompanies))
    }
  }

  async updateById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.companyService.updateById(req.params.id, req.body)

      res.status(204).end()
    } catch (err) {
      next(buildError(err, errorResponsesConfig.general, 500))
    }
  }

  async deleteById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id

      if (!isAlphaNumeric(id)) {
        const e = new Error("Company :id is invalid")
        return next(buildError(e, errorResponsesConfig.invalidCompanyId, 400))
      }

      await this.companyService.deleteById(id)

      res.status(204).end()
    } catch (err) {
      next(buildError(err, errorResponsesConfig.general, 500))
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const company = await this.companyService.create(req.body)

      res
        .location(`${getEnvBasedDomain(req)}/companies/${req.body.company_id}`)
        .status(201)
        .json(company)
    } catch (err) {
      next(err)
    }
  }
}

export default Company
