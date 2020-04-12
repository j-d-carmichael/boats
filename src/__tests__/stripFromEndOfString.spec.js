const stripFromEnd = require('../stripFromEndOfString')

describe('stripFromEndOfString', () => {
  it('.yml.njk', () => {
    expect(stripFromEnd('test.yml.njk', '.yml.njk')).toBe('test');
  });
  it('.njk', () => {
    expect(stripFromEnd('test.yml.njk', '.njk')).toBe('test.yml');
  });
});
