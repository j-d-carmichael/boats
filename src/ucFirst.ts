export default (string: string): string => {
  if (typeof string !== 'string') {
    throw new Error('Param passed to ucfirst is not type string but type: ' + typeof string)
  }
  return string.charAt(0).toUpperCase() + string.slice(1)
}
