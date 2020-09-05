import UniqueOperationIds from '../UniqueOperationIds';
import { StringStyle } from '@/enums/StringStyle';

it('standard action v1WeatherGet', () => {
  expect(
    UniqueOperationIds.getUniqueOperationIdFromPath('src/paths/v1/weather/get.yml', 'paths/', undefined, 'src/')
  ).toBe('v1WeatherGet');
});
it('custom strip value', () => {
  expect(
    UniqueOperationIds.getUniqueOperationIdFromPath(
      'src/paths/more/v1/weather/get.yml',
      'paths/more/',
      undefined,
      'src/'
    )
  ).toBe('v1WeatherGet');
});

it('handle snake-case', () => {
  expect(
    UniqueOperationIds.getUniqueOperationIdFromPath(
      'src/paths/more/v1/weather-is-bad/get.yml',
      'paths/more/',
      undefined,
      'src/'
    )
  ).toBe('v1WeatherIsBadGet');
});

it('handle snake-case', () => {
  expect(
    UniqueOperationIds.getUniqueOperationIdFromPath(
      'some/dir/src/paths/weather-is-bad/get.yml',
      'src/paths/',
      undefined,
      'some/dir/'
    )
  ).toBe('weatherIsBadGet');
});

it('should be able to remove the method if present', async () => {
  expect(
    UniqueOperationIds.getUniqueOperationIdFromPath(
      'some/dir/src/paths/weather-is-bad/get.yml',
      'src/paths/',
      undefined,
      'some/dir/',
      true
    )
  ).toBe('weatherIsBad');
});

it('should be able to inject a single preset', async () => {
  expect(
    UniqueOperationIds.getUniqueOperationIdFromPath(
      'src/paths/weather-is-bad/get.yml',
      'src/paths/',
      undefined,
      'some/dir/',
      true,
      StringStyle.camelCase,
      StringStyle.camelCase,
      ['bobby']
    )
  ).toBe('bobbyWeatherIsBad');
});

it('should be able to inject many presets', async () => {
  expect(
    UniqueOperationIds.getUniqueOperationIdFromPath(
      'src/paths/weather-is-bad/get.yml',
      'src/paths/',
      undefined,
      'some/dir/',
      true,
      StringStyle.camelCase,
      StringStyle.camelCase,
      ['bobby', 'Awesome']
    )
  ).toBe('bobbyAwesomeWeatherIsBad');
});

it('should be able to inject many presets and Pascal case', async () => {
  expect(
    UniqueOperationIds.getUniqueOperationIdFromPath(
      'src/paths/weather-is-bad/get.yml',
      'src/paths/',
      undefined,
      'some/dir/',
      true,
      StringStyle.PascalCase,
      StringStyle.camelCase,
      ['bobby', 'Awesome']
    )
  ).toBe('BobbyAwesomeWeatherIsBad');
});

it('should be able to inject many presets and snake case', async () => {
  expect(
    UniqueOperationIds.getUniqueOperationIdFromPath(
      'src/paths/weather-is-bad/get.yml',
      'src/paths/',
      undefined,
      'some/dir/',
      true,
      StringStyle.snakeCase,
      StringStyle.camelCase,
      ['bobby', 'Awesome']
    )
  ).toBe('bobby_awesome_weatherIsBad');
});

it('should be able to inject many presets and kebab case', async () => {
  expect(
    UniqueOperationIds.getUniqueOperationIdFromPath(
      'src/paths/weather-is-bad/get.yml',
      'src/paths/',
      undefined,
      'some/dir/',
      true,
      StringStyle.kebabCase,
      StringStyle.camelCase,
      ['bobby', 'Awesome']
    )
  ).toBe('bobby-awesome-weatherIsBad');
});

it('should be able to inject many presets and kebab case and kebab case for the segment style', async () => {
  expect(
    UniqueOperationIds.getUniqueOperationIdFromPath(
      'src/paths/weather-is-bad/get.yml',
      'src/paths/',
      undefined,
      'some/dir/',
      true,
      StringStyle.kebabCase,
      StringStyle.kebabCase,
      ['bobby', 'Awesome']
    )
  ).toBe('bobby-awesome-weather-is-bad');
});

it('should be able to inject many presets and snakeCase overall and snakeCase for the segment style', async () => {
  expect(
    UniqueOperationIds.getUniqueOperationIdFromPath(
      'src/paths/weather-is-bad/get.yml',
      'src/paths/',
      undefined,
      'some/dir/',
      true,
      StringStyle.snakeCase,
      StringStyle.snakeCase,
      ['bobby', 'Awesome']
    )
  ).toBe('bobby_awesome_weather_is_bad');
});

it('should be able to inject many presets and kebab case and kebab case for the segment style', async () => {
  expect(
    UniqueOperationIds.getUniqueOperationIdFromPath(
      'src/paths/weather-is-bad/get.yml',
      'src/paths/',
      undefined,
      'some/dir/',
      true,
      StringStyle.snakeCase,
      StringStyle.kebabCase,
      ['bobby', 'Awesome']
    )
  ).toBe('bobby_awesome_weather-is-bad');
});
