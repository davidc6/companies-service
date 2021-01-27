export type ResponseErrorType = {
  title: string
  status: number
  detail: string
  instance: string
  e: Error
  stack?: string
}

export const ResponseError = (
  title: string,
  status = 500,
  instance = "",
  detail = "",
  e: Error
): ResponseErrorType => ({
  title,
  status,
  detail,
  instance,
  e,
})
