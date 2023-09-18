import UniqueOperationIds from '../UniqueOperationIds';
import { StringStyle } from '@/enums/StringStyle';

it('standard action v1WeatherGet', () => {
  expect(
    UniqueOperationIds.getUniqueOperationIdFromPath({
      filePath: 'src/paths/v1/weather/get.yml',
      stripValue: 'paths/',
      cwd: 'src/'
    })
  ).toBe('v1WeatherGet');
});
it('custom strip value', () => {
  expect(
    UniqueOperationIds.getUniqueOperationIdFromPath({
      filePath: 'src/paths/more/v1/weather/get.yml',
      stripValue: 'paths/more/',
      cwd: 'src/'
    })
  ).toBe('v1WeatherGet');
});

it('handle snake-case', () => {
  expect(
    UniqueOperationIds.getUniqueOperationIdFromPath({
      filePath: 'src/paths/more/v1/weather-is-bad/get.yml',
      stripValue: 'paths/more/',
      cwd: 'src/'
    })
  ).toBe('v1WeatherIsBadGet');
});

it('handle snake-case', () => {
  expect(
    UniqueOperationIds.getUniqueOperationIdFromPath({
      filePath: 'some/dir/src/paths/weather-is-bad/get.yml',
      stripValue: 'src/paths/',
      cwd: 'some/dir/'
    })
  ).toBe('weatherIsBadGet');
});

it('should be able to remove the method if present', async () => {
  expect(
    UniqueOperationIds.getUniqueOperationIdFromPath({
      filePath: 'some/dir/src/paths/weather-is-bad/get.yml',
      stripValue: 'src/paths/',
      cwd: 'some/dir/',
      removeMethod: true
    })
  ).toBe('weatherIsBad');
});

it('should be able to inject a single preset', async () => {
  expect(
    UniqueOperationIds.getUniqueOperationIdFromPath({
      filePath: 'src/paths/weather-is-bad/get.yml',
      stripValue: 'src/paths/',
      cwd: 'some/dir/',
      removeMethod: true,
      style: StringStyle.camelCase,
      segmentStyle: StringStyle.camelCase,
      prefixes: ['bobby']
    })
  ).toBe('bobbyWeatherIsBad');
});

it('should be able to inject many presets', async () => {
  expect(
    UniqueOperationIds.getUniqueOperationIdFromPath({
      filePath: 'src/paths/weather-is-bad/get.yml',
      stripValue: 'src/paths/',
      cwd: 'some/dir/',
      removeMethod: true,
      style: StringStyle.camelCase,
      segmentStyle: StringStyle.camelCase,
      prefixes: ['bobby', 'Awesome']
    })
  ).toBe('bobbyAwesomeWeatherIsBad');
});

it('should be able to inject many presets and Pascal case', async () => {
  expect(
    UniqueOperationIds.getUniqueOperationIdFromPath({
      filePath: 'src/paths/weather-is-bad/get.yml',
      stripValue: 'src/paths/',
      cwd: 'some/dir/',
      removeMethod: true,
      style: StringStyle.PascalCase,
      segmentStyle: StringStyle.camelCase,
      prefixes: ['bobby', 'Awesome']
    })
  ).toBe('BobbyAwesomeWeatherIsBad');
});

it('should be able to inject many presets and snake case', async () => {
  expect(
    UniqueOperationIds.getUniqueOperationIdFromPath({
      filePath: 'src/paths/weather-is-bad/get.yml',
      stripValue: 'src/paths/',
      cwd: 'some/dir/',
      removeMethod: true,
      style: StringStyle.snakeCase,
      segmentStyle: StringStyle.camelCase,
      prefixes: ['bobby', 'Awesome']
    })
  ).toBe('bobby_awesome_weatherIsBad');
});

it('should be able to inject many presets and kebab case', async () => {
  expect(
    UniqueOperationIds.getUniqueOperationIdFromPath({
      filePath: 'src/paths/weather-is-bad/get.yml',
      stripValue: 'src/paths/',
      cwd: 'some/dir/',
      removeMethod: true,
      style: StringStyle.kebabCase,
      segmentStyle: StringStyle.camelCase,
      prefixes: ['bobby', 'Awesome']
    })
  ).toBe('bobby-awesome-weatherIsBad');
});

it('should be able to inject many presets and kebab case and kebab case for the segment style', async () => {
  expect(
    UniqueOperationIds.getUniqueOperationIdFromPath({
      filePath: 'src/paths/weather-is-bad/get.yml',
      stripValue: 'src/paths/',
      cwd: 'some/dir/',
      removeMethod: true,
      style: StringStyle.kebabCase,
      segmentStyle: StringStyle.kebabCase,
      prefixes: ['bobby', 'Awesome']
    })
  ).toBe('bobby-awesome-weather-is-bad');
});

it('should be able to inject many presets and snakeCase overall and snakeCase for the segment style', async () => {
  expect(
    UniqueOperationIds.getUniqueOperationIdFromPath({
      filePath: 'src/paths/weather-is-bad/get.yml',
      stripValue: 'src/paths/',
      cwd: 'some/dir/',
      removeMethod: true,
      style: StringStyle.snakeCase,
      segmentStyle: StringStyle.snakeCase,
      prefixes: ['bobby', 'Awesome']
    })
  ).toBe('bobby_awesome_weather_is_bad');
});

it('should be able to inject many presets and kebab case and kebab case for the segment style', async () => {
  expect(
    UniqueOperationIds.getUniqueOperationIdFromPath({
      filePath: 'src/paths/weather-is-bad/get.yml',
      stripValue: 'src/paths/',
      cwd: 'some/dir/',
      removeMethod: true,
      style: StringStyle.snakeCase,
      segmentStyle: StringStyle.kebabCase,
      prefixes: ['bobby', 'Awesome']
    })
  ).toBe('bobby_awesome_weather-is-bad');
});

describe('firstSegmentSplit tests', () => {
  it('should separate with .', async () => {
    expect(
      UniqueOperationIds.getUniqueOperationIdFromPath({
        filePath: 'src/paths/weather/is-bad/get.yml',
        stripValue: 'src/paths/',
        cwd: 'some/dir/',
        firstSegmentSplit: '.'
      })
    ).toBe('weather.isBadGet');
  });

  it('should separate with _', async () => {
    expect(
      UniqueOperationIds.getUniqueOperationIdFromPath({
        filePath: 'src/paths/weather/is-bad/get.yml',
        stripValue: 'src/paths/',
        cwd: 'some/dir/',
        firstSegmentSplit: '_'
      })
    ).toBe('weather_isBadGet');
  });

  it('should separate with - but also the camel case should be applied to the first segment even though there is a split highlight passed', async () => {
    expect(
      UniqueOperationIds.getUniqueOperationIdFromPath({
        filePath: 'src/paths/weather-is/bad/get.yml',
        stripValue: 'src/paths/',
        cwd: 'some/dir/',
        firstSegmentSplit: '-'
      })
    ).toBe('weatherIs-badGet');
  });
});
