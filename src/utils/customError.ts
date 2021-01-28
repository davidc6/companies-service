export class CustomError extends Error {
  status = 500
  title = ""
  detail = ""

  constructor(error: Error) {
    super(error.message)
    this.stack = error.stack
  }
}
