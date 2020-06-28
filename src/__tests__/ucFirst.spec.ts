import ucFirst from '../ucFirst'

describe('ucFirst', () => {
  it('uppercase a lowercase start', () => {
    expect(ucFirst('john')).toBe('John')
  })

  it('uppercase a uppercase start', () => {
    expect(ucFirst('John')).toBe('John')
  })

  it('uppercase a uppercase single letter', () => {
    expect(ucFirst('j')).toBe('J')
  })

  it('lowercase an empty start', () => {
    expect(ucFirst('')).toBe('')
  })
})
