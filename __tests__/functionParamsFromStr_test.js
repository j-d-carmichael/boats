import functionParamsFromStr from '../es6/functionParamsFromStr'

describe('functionParamsFromStr', () => {
  it('test single quotes', () => {
    let result = functionParamsFromStr("mixin('../something', 'else')")
    expect(result).toEqual(['../something', 'else'])
  })

  it('Whole string wrapped in single quotes', () => {
    let result = functionParamsFromStr("'mixin('../something', 'else')'")
    expect(result).toEqual(['../something', 'else'])
  })

  it('test double quotes', () => {
    let result = functionParamsFromStr('mixin("../something", "else")')
    expect(result).toEqual(['../something', 'else'])
  })

  it('Whole double quotes string wrapped in single quotes', () => {
    let result = functionParamsFromStr('\'mixin("../something", "else")\'')
    expect(result).toEqual(['../something', 'else'])
  })
})
