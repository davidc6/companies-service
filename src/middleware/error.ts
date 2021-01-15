import { Request, Response, NextFunction } from 'express';

const handleError = (app) => {
  app.use((err, req: Request, res: Response, next: NextFunction) => {
    res
      .status(err.status || 500)
      .json({
        message: err.message
      });
  });
}

export { handleError }
