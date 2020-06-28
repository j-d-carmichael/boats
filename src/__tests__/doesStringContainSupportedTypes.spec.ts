import doesIt from '../apiTypeFromString'

it('should return true', () => {
  expect(doesIt(`asyncapi
  more words that
  need to be something
  lorem`)).toBe('asyncapi')
})

it('should return true', () => {
  expect(doesIt(`openapi
  more
  words`)).toBe('openapi')
})

it('should return true', () => {
  expect(doesIt(`swagger, bob cat thing
more words`)).toBe('swagger')
})

it('should return false', () => {
  expect(doesIt(`bob cat thing
more words`)).toBe(false)
})
