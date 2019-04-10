import ucFirst from '../es6/ucFirst'

describe('ucFirst', () => {
  it('uppercase a lowercase start', () => {
    expect(ucFirst('john')).toBe('John')
  })
})
