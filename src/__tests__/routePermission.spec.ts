import routePermission from '@/routePermission';

it('should return the global then the prefix then the rest without the method - all camelCased', async () => {
  const r = routePermission(
    {
      nunjucksOptions: {
        tags: {},
      },
      permissionConfig: {
        globalPrefix: 'hello',
      },
    },
    'src/paths/weather-is-bad/get.yml',
    'src/paths',
    'bob',
    '',
    true
  );
  expect(r).toBe('helloBobReadWeatherIsBad');
});
