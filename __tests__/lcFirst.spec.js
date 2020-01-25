const lcFirst = require('../src/lcFirst');

describe('lcFirst', () => {
  it('lowercase an uppercase start', () => {
    expect(lcFirst('John')).toBe('john');
  });

  it('lowercase a lowercase start', () => {
    expect(lcFirst('john')).toBe('john');
  });

  it('lowercase a lowercase single', () => {
    expect(lcFirst('J')).toBe('j');
  });

  it('lowercase an empty start', () => {
    expect(lcFirst('')).toBe('');
  });
});
