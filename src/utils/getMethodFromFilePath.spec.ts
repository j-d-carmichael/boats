import getMethodFromFilePath from '@/utils/getMethodFromFilePath';

it('should return get from .yml file', async () => {
  expect(getMethodFromFilePath('some/path/get.yml')).toBe('get');
});

it('should return get from .yml.njk file', async () => {
  expect(getMethodFromFilePath('some/path/get.yml.njk')).toBe('get');
});
