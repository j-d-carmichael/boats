import lcFirst from '../es6/lcFirst'

describe('lcFirst', () => {
  it('lowercase an uppercase start', () => {
    expect(lcFirst('John')).toBe('john')
  })
})
