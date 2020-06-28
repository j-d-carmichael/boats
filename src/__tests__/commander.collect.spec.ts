import collect from '../commander.collect';

test('add bob=bob and expect as object in arr', () => {
  expect(collect('bob=bob', [])).toEqual([{
    bob: 'bob'
  }]);
});

test('add bob and expect as object in arr bob is true', () => {
  expect(collect('bob', [])).toEqual([{
    bob: true
  }]);
});

test('add bob=bob and bob and expect array of objects', () => {
  const response = collect('bob', []);

  expect(collect('bob=bob', response)).toEqual([{
    bob: true
  }, {
    bob: 'bob'
  }]);
});
