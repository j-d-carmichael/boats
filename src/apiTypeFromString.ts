export default (str: string): string | boolean => {
  const regex = new RegExp(/swagger|openapi|asyncapi/gm)
  if (regex.test(str)) {
    const swagger = new RegExp(/swagger/gm)
    if (swagger.test(str)) {
      return 'swagger'
    }
    const openapi = new RegExp(/openapi/gm)
    if (openapi.test(str)) {
      return 'openapi'
    }
    const asyncapi = new RegExp(/asyncapi/gm)
    if (asyncapi.test(str)) {
      return 'asyncapi'
    }
  }
  return false
}
