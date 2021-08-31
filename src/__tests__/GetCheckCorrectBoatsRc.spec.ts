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

it('should warn and write old config naming to new', async () => {
  // @ts-ignore
  global.console = {
    warn: jest.fn(),
  };
  const newRc = CheckBoatsRcAndCorrect.parse({
    nunjucksOptions: {
      tags: {},
    },
    permissionConfig: {
      usePackageJsonNameAsPrefix: true,
      routePrefix: {},
    },
    fancyPluralization: true
  });
  expect(global.console.warn).toHaveBeenCalled();
  expect(newRc.permissionConfig.usePackageJsonNameAsPrefix).toBe(undefined);
  expect(newRc.permissionConfig.globalPrefix).toBe(true);
  expect(newRc.permissionConfig.routePrefix).toBe(undefined);
  expect(newRc.permissionConfig.methodAlias).toEqual({});
  expect(newRc.fancyPluralization).toEqual(true);
});
