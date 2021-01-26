export const isAlphaNumeric = (val: string): boolean => {
  const regex = /^[a-zA-Z0-9-]+$/
  const re = new RegExp(regex)

  return re.test(val)
}
