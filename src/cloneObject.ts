/**
 * Clones an object and returns
 */
export default (obj: Record<string, unknown>): Record<string, unknown> => {
  return JSON.parse(JSON.stringify(obj))
}
