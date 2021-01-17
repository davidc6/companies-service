import { NextFunction, Request, Response } from 'express'

export const errorHandler = (err, req: Request, res: Response, next: NextFunction): void => {
  res
    .status(err.status)
    .json({
      message: err.message,
    })
}
