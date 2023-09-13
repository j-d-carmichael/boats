import autoSummary from '@/autoSummary';

it('should return just the method', async () => {
  expect(
    autoSummary('get.yml')
  ).toBe(
    'Get'
  );
});

it('should return the method with User', async () => {
  expect(
    autoSummary('user/get.yml')
  ).toBe(
    'Get user'
  );
});

it('user/{id}/get.yml', async () => {
  expect(
    autoSummary('user/{id}/get.yml')
  ).toBe(
    'Get user based on {id}'
  );
});

it('house/{number}/user/{id}/get.yml', async () => {
  expect(
    autoSummary('house/{number}/user/{id}/get.yml')
  ).toBe(
    'Get user based on {id}, from house {number}'
  );
});

it('street/{name}/house/{number}/user/{id}/get.yml', async () => {
  expect(
    autoSummary('street/{name}/house/{number}/user/{id}/get.yml')
  ).toBe(
    'Get user based on {id}, from house {number}, from street {name}'
  );
});

it('streets/location/houses/get.yml', async () => {
  expect(
    autoSummary('streets/location/houses/get.yml')
  ).toBe(
    'Get houses, from location, from streets'
  );
});

it('/streets/location/houses/get.yml', async () => {
  expect(
    autoSummary('streets/location/houses/get.yml')
  ).toBe(
    'Get houses, from location, from streets'
  );
});

it('/streets/location/{name}/house/put.yml', async () => {
  expect(autoSummary('streets/location/{name}/house/put.yml')).toBe(
    'Update a house, from location {name}, from streets'
  );
});

it('/streets/location/{name}/house/patch.yml', async () => {
  expect(autoSummary('streets/location/{name}/house/patch.yml')).toBe(
    'Update part of a house, from location {name}, from streets'
  );
});

it('/streets/location/{name}/house/delete.yml', async () => {
  expect(autoSummary('streets/location/{name}/house/delete.yml')).toBe(
    'Delete a house, from location {name}, from streets'
  );
});

it('leave the name in place   /streets/location/{name}/house/out.yml', async () => {
  expect(autoSummary('streets/location/{name}/house/our.yml', {useFileName: true})).toBe(
    ' Our, from house, from location {name}, from streets'
  );
});
