import { Application, Response, Request, NextFunction } from "express"
import { checkSchema, validationResult } from "express-validator"
import { getEnvBasedDomain } from "./utils/domain"
import { apiKeyValidator } from "./middleware/apiKeyValidator"
import Company from "./controllers/company"
import CompanyService from "./services/company"

const mountRoutes = (app: Application): void => {
  app.get("/", (req: Request, res: Response) => {
    const response = {
      current_url: getEnvBasedDomain(req),
      all_companies_url: `${getEnvBasedDomain(req)}/companies`,
      company_url: `${getEnvBasedDomain(req)}/companies/{company_id}`,
    }

    res.status(200).json(response)
  })

  app.get("/companies", (req: Request, res: Response, next: NextFunction) => {
    const company = new Company(new CompanyService())
    company.getAll(req, res, next)
  })

  app.get("/companies/:id", (req: Request, res: Response, next: NextFunction) => {
    const company = new Company(new CompanyService())
    company.getById(req, res, next)
  })

  app.patch(
    "/companies/:id",
    apiKeyValidator,
    async (req: Request, res: Response, next: NextFunction) => {
      const company = new Company(new CompanyService())
      company.updateById(req, res, next)
    }
  )

  app.delete(
    "/companies/:id",
    apiKeyValidator,
    async (req: Request, res: Response, next: NextFunction) => {
      const company = new Company(new CompanyService())
      company.deleteById(req, res, next)
    }
  )

  app.post(
    "/companies",
    apiKeyValidator,
    checkSchema({
      name: {
        matches: {
          bail: true,
          options: [/^[a-zA-Z0-9 ]*$/, "g"],
          errorMessage: "format is incorrect",
        },
      },
      industry: {
        isAlpha: {
          bail: true,
          errorMessage: "should only contain letters",
        },
      },
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        validationResult(req).throw()

        const company = new Company(new CompanyService())
        company.create(req, res, next)
      } catch (err) {
        next(err)
      }
    }
  )
}

export { mountRoutes }
