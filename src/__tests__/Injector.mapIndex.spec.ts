import Injector from '@/Injector';
import path from 'path';

it('should ', async () => {
  const index = `
/ms-auth/cache-connection:
  $ref: ./ms-auth/cache-connection.yml
/ms-auth/cache-user:
  $ref: ./ms-auth/cache-user.yml
`;
  Injector.mapChannelIndex(
    index,
    path.join(
      process.cwd(),
      'test-build/srcASYNC2/channels/index.yml'
    )
  );
  expect(Object.keys(Injector.fileToRouteMap).length).toEqual(2);
});

