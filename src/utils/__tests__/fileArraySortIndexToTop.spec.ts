import fileArraySortIndexToTop from '@/utils/fileArraySortIndexToTop';

it('should pass', () => {
  const a = [
    'ina.yml',
    'index.yml',
    'something/cat/animal.yml',
    'something/cat/index.yml',
    'something/cat/speed.yml',
    'something/dog/animal.yml',
    'something/dog/colour.yml',
    'something/dog/index.yml',
    'something/dog/indexed.yml',
    'something/dog/speed.yml'
  ];
  expect(fileArraySortIndexToTop(a)).toEqual([
    'index.yml',
    'ina.yml',
    'something/cat/index.yml',
    'something/cat/animal.yml',
    'something/cat/speed.yml',
    'something/dog/index.yml',
    'something/dog/animal.yml',
    'something/dog/colour.yml',
    'something/dog/indexed.yml',
    'something/dog/speed.yml'
  ]);
});

it('should pass', () => {
  const a = [
    'ina.yml.njk',
    'index.yml.njk',
    'something/cat/animal.yml.njk',
    'something/cat/index.yml.njk',
    'something/cat/speed.yml.njk',
    'something/dog/animal.yml.njk',
    'something/dog/colour.yml.njk',
    'something/dog/index.yml.njk',
    'something/dog/indexed.yml.njk',
    'something/dog/speed.yml.njk'
  ];
  expect(fileArraySortIndexToTop(a)).toEqual([
    'index.yml.njk',
    'ina.yml.njk',
    'something/cat/index.yml.njk',
    'something/cat/animal.yml.njk',
    'something/cat/speed.yml.njk',
    'something/dog/index.yml.njk',
    'something/dog/animal.yml.njk',
    'something/dog/colour.yml.njk',
    'something/dog/indexed.yml.njk',
    'something/dog/speed.yml.njk'
  ]);
});
