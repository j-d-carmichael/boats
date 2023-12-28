import fileArraySortIndexToTop from '@/utils/fileArraySortIndexToTop';

const a = [
  'ina',
  'index',
  'something/cat/animal',
  'something/cat/index',
  'something/cat/speed',
  'something/dog/animal',
  'something/dog/colour',
  'something/dog/index',
  'something/dog/speed'
];

it('should', () => {
  expect(fileArraySortIndexToTop(a)).toEqual([
    'index',
    'ina',
    'something/cat/index',
    'something/cat/animal',
    'something/cat/speed',
    'something/dog/index',
    'something/dog/animal',
    'something/dog/colour',
    'something/dog/speed'
  ]);
});

