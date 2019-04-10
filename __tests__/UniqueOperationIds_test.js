import UniqueOperationIds from '../es6/UniqueOperationIds'

describe('getUniqueOperationIdFromPath', () => {
  it('standard action v1WeatherGet', () => {
    expect(
      UniqueOperationIds.getUniqueOperationIdFromPath('src/paths/v1/weather/get.yml', 'paths/', 'src/')
    ).toBe(
      'v1WeatherGet'
    )
  })
  it('custom strip value', () => {
    expect(
      UniqueOperationIds.getUniqueOperationIdFromPath('src/paths/more/v1/weather/get.yml', 'paths/more/', 'src/')
    ).toBe(
      'v1WeatherGet'
    )
  })
})


describe('removeFileExtension', () => {
  it('Removes .yml from path provided', () => {
    expect(
      UniqueOperationIds.removeFileExtension('paths/v1/weather/get.yml')
    ).toBe(
      'paths/v1/weather/get'
    )
  })

  it('Handles multiple . in path', () => {
    expect(
      UniqueOperationIds.removeFileExtension('paths/v1/weather/get.post.yml')
    ).toBe(
      'paths/v1/weather/get.post'
    )
  })
})
