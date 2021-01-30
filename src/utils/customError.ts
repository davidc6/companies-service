export class CustomError extends Error {
  status = 500
  title = ""
  detail = ""

  constructor(error: Error) {
    super(error.message)
    this.stack = error.stack
  }
}

type ResponseConfig = {
  title: string
  detail: string
}

export const buildError = (e: Error, config: ResponseConfig, status = 500): CustomError => {
  const error = new CustomError(e)

  error.title = config?.title
  error.detail = config?.detail
  error.status = status

  return error
}
