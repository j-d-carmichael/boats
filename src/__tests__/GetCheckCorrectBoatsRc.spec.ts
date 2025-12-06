import CheckBoatsRcAndCorrect from '@/GetCheckCorrectBoatsRc';

it('should warn about the invalid string style types', async () => {
  // @ts-ignore
  global.console = {
    warn: jest.fn(),
  };
  CheckBoatsRcAndCorrect.parse({
    nunjucksOptions: {
      tags: {},
    },
    permissionConfig: {
      // @ts-ignore
      permissionStyle: 'snakeCase',
    },
  });
  expect(global.console.warn).toHaveBeenCalled();
});
