import UniqueOperationIds from '../UniqueOperationIds';

it('standard action v1WeatherGet', () => {
  expect(
    UniqueOperationIds.getUniqueOperationIdFromPath('src/paths/v1/weather/get.yml', 'paths/', undefined, 'src/')
  ).toBe(
    'v1WeatherGet'
  );
});
it('custom strip value', () => {
  expect(
    UniqueOperationIds.getUniqueOperationIdFromPath('src/paths/more/v1/weather/get.yml', 'paths/more/', undefined, 'src/')
  ).toBe(
    'v1WeatherGet'
  );
});

it('handle snake-case', () => {
  expect(
    UniqueOperationIds.getUniqueOperationIdFromPath('src/paths/more/v1/weather-is-bad/get.yml', 'paths/more/', undefined, 'src/')
  ).toBe(
    'v1WeatherIsBadGet'
  );
});

it('handle snake-case', () => {
  expect(
    UniqueOperationIds.getUniqueOperationIdFromPath('some/dir/src/paths/weather-is-bad/get.yml', 'src/paths/', undefined, 'some/dir/')
  ).toBe(
    'weatherIsBadGet'
  );
});

it('should be able to remove the method if present', async () => {
  expect(
    UniqueOperationIds.getUniqueOperationIdFromPath('some/dir/src/paths/weather-is-bad/get.yml', 'src/paths/', undefined, 'some/dir/', true)
  ).toBe(
    'weatherIsBad'
  );
});
