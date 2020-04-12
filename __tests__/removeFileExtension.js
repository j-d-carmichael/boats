const removeFileExtension = require('../src/removeFileExtension')
describe('removeFileExtension', () => {
  it('Removes .yml from path provided', () => {
    expect(
      removeFileExtension('paths/v1/weather/get.yml')
    ).toBe(
      'paths/v1/weather/get'
    );
  });

  it('Handles multiple . in path', () => {
    expect(
      removeFileExtension('paths/v1/weather/get.post.yml')
    ).toBe(
      'paths/v1/weather/get.post'
    );
  });
  it('Handles .yml.njk', () => {
    expect(
      removeFileExtension('paths/v1/weather/get.post.yml.njk')
    ).toBe(
      'paths/v1/weather/get.post'
    );
  });
});
