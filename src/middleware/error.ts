import { Application, Request, Response, NextFunction } from 'express'

const handleError = (app: Application) => {
  app.use((err, req: Request, res: Response, next: NextFunction) => {
    res
      .status(err.status)
      .json({
        message: err.message,
      })
  })
}

export { handleError }
