import generatePermissionsSchema from '../generatePermissionsSchema';
import _ from 'lodash';

const originalConsoleInfo = console.info;

describe('generatePermissionsSchema', () => {
  let bundledJson: any;
  let mockConsoleInfo: any;

  beforeEach(() => {
    bundledJson = {
      components: {
        schemas: {
          MyExistingSchema: { type: 'string' }
        }
      },
      definitions: {
        MyExistingSchema: { type: 'string' }
      },
      paths: {
        '/path1': {
          get: { nobody: 'cares' }
        },
        '/path2': {
          get: { who: 'cares' },
          post: { nobody: 'cares at all' }
        }
      }
    };

    mockConsoleInfo = jest.fn();
  });

  afterEach(() => {
    console.info = originalConsoleInfo;
  });

  const makeExpectedJson = (schemaName: string, permissions: string[]) => {
    const originalJson = _.cloneDeep(bundledJson)

    if (originalJson.swagger) {
      return {
        ...originalJson,
        definitions: {
          ...(originalJson.definitions || {}),
          [schemaName]: {
            type: 'string',
            enum: permissions
          }
        }
      };
    }

    return {
      ...originalJson,
      components: {
        ...originalJson.components,
        schemas: {
          ...(originalJson.components.schemas || {}),
          [schemaName]: {
            type: 'string',
            enum: permissions
          }
        }
      }
    };
  };

  it('openapi: does not modify schema when the option is disabled', () => {
    const previousJson = _.cloneDeep(bundledJson);
    expect(generatePermissionsSchema(bundledJson, '')).toEqual(previousJson);
    expect(generatePermissionsSchema(bundledJson, undefined)).toEqual(previousJson);
  });

  it('swagger: does not modify schema when the option is disabled', () => {
    bundledJson.swagger = '2.0';
    const previousJson = _.cloneDeep(bundledJson);
    expect(generatePermissionsSchema(bundledJson, '')).toEqual(previousJson);
    expect(generatePermissionsSchema(bundledJson, undefined)).toEqual(previousJson);
  });

  it('openapi: does not modify schema when the option is enabled but there are no permissions', () => {
    const previousJson = _.cloneDeep(bundledJson);
    expect(generatePermissionsSchema(bundledJson, 'Permissions')).toEqual(previousJson);
  });

  it('swagger: does not modify schema when the option is enabled but there are no permissions', () => {
    bundledJson.swagger = '2.0';
    const previousJson = _.cloneDeep(bundledJson);
    expect(generatePermissionsSchema(bundledJson, 'Permissions')).toEqual(previousJson);
  });

  it('openapi: adds permissions when the option is enabled', () => {
    const schemaName = 'MyPermissions';
    const permissions = [
      'coolPermission1',
      'coolerPermission2',
      'awesomePermission3'
    ];

    bundledJson.paths['/path1'].get['x-permission'] = permissions[0];
    bundledJson.paths['/path2'].get['x-permission'] = permissions[1];
    bundledJson.paths['/path2'].post['x-permission'] = permissions[2];

    const expectedJson = makeExpectedJson(schemaName, permissions);
    expect(generatePermissionsSchema(bundledJson, schemaName)).toEqual(expectedJson);
  });

  it('swagger: adds permissions when the option is enabled', () => {
    bundledJson.swagger = '2.0';

    const schemaName = 'MyPermissions';
    const permissions = [
      'coolPermission1',
      'coolerPermission2',
      'awesomePermission3'
    ];

    bundledJson.paths['/path1'].get['x-permission'] = permissions[0];
    bundledJson.paths['/path2'].get['x-permission'] = permissions[1];
    bundledJson.paths['/path2'].post['x-permission'] = permissions[2];

    const expectedJson = makeExpectedJson(schemaName, permissions);
    expect(generatePermissionsSchema(bundledJson, schemaName)).toEqual(expectedJson);
  });

  it('openapi: adds permissions when there are no schemas at all', () => {
    const schemaName = 'MySwaggerPermissions';
    const permissions = [
      'coolPermission4',
      'coolerPermission5',
      'awesomePermission6'
    ];

    delete bundledJson.components.schemas;
    bundledJson.paths['/path1'].get['x-permission'] = permissions[0];
    bundledJson.paths['/path2'].get['x-permission'] = permissions[1];
    bundledJson.paths['/path2'].post['x-permission'] = permissions[2];

    const expectedJson = makeExpectedJson(schemaName, permissions);
    expect(generatePermissionsSchema(bundledJson, schemaName)).toEqual(expectedJson);
  });

  it('swagger: adds permissions when there are no schemas at all', () => {
    bundledJson.swagger = '2.0';

    const schemaName = 'MySwaggerPermissions';
    const permissions = [
      'coolPermission4',
      'coolerPermission5',
      'awesomePermission6'
    ];

    delete bundledJson.definitions;
    bundledJson.paths['/path1'].get['x-permission'] = permissions[0];
    bundledJson.paths['/path2'].get['x-permission'] = permissions[1];
    bundledJson.paths['/path2'].post['x-permission'] = permissions[2];

    const expectedJson = makeExpectedJson(schemaName, permissions);
    expect(generatePermissionsSchema(bundledJson, schemaName)).toEqual(expectedJson);
  });

  it('openapi: informs when the autogenerated schema overwrites an exisitng schema', () => {
    bundledJson.paths['/path1'].get['x-permission'] = 'readPath1Get';
    console.info = mockConsoleInfo;

    const schemaName = 'MyExistingSchema';
    generatePermissionsSchema(bundledJson, schemaName);

    expect(mockConsoleInfo).toBeCalledWith(
      `INFO: Schema named "${schemaName}" already exists, overwriting this with the generated permissions schema.`
    );
  });

  it('swagger: informs when the autogenerated schema overwrites an exisitng schema', () => {
    bundledJson.swagger = '2.0';
    bundledJson.paths['/path1'].get['x-permission'] = 'readPath1Get';
    console.info = mockConsoleInfo;

    const schemaName = 'MyExistingSchema';
    generatePermissionsSchema(bundledJson, schemaName);

    expect(mockConsoleInfo).toBeCalledWith(
      `INFO: Schema named "${schemaName}" already exists, overwriting this with the generated permissions schema.`
    )
  });
});
