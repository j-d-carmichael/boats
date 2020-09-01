import path from 'path';
import hasha from 'hasha';
import fs from 'fs-extra';
import jsYaml from 'js-yaml';

jest.setTimeout(60 * 1000); // in milliseconds

describe('Check to ensure the files are generated with the correct file names:', () => {
  const paths = [
    'test-build/srcASYNC2/srcASYNC2_1.0.1.yml',
    'test-build/builtOA2_std/builtOA2_std_1.0.1.yml',
    'test-build/builtOA2_readonly/builtOA2_readonly_1.0.1.yml',
    'test-build/builtOA2_no_version/builtOA2_no_version.yml',
    'test-build/builtOA3_std/builtOA3_1.0.1.yml',
    'test-build/builtOA3_exclude/builtOA3.yml',
    'test-build/builtOA2_inject/api_1.0.1.yml',
  ];

  it('Check all files have been created', (done) => {
    for (let i = 0; i < paths.length; ++i) {
      const filePath = paths[i][0];
      if (!fs.pathExistsSync(filePath)) {
        done('Not found filePath: ' + filePath);
      }
    }
    done();
  });

  it('built srcASYNC2_1.0.1.yml', async () => {
    const infile: any = jsYaml.safeLoad(fs.readFileSync('test-build/srcASYNC2/srcASYNC2_1.0.1.yml', 'utf8'));
    expect(infile).toEqual({
      asyncapi: '2.0.0',
      info: {
        title: 'boats',
        version: '1.0.1',
        description: 'Beautiful Open / Async Template System - Write less yaml with BOATS and Nunjucks.',
        license: { name: 'Apache 2.0', url: 'https://www.apache.org/licenses/LICENSE-2.0' },
      },
      defaultContentType: 'application/json',
      channels: {
        '/ms-auth/cache-connection': {
          description: 'When a new connection change occurs the new cache values are emitted in the payload',
          publish: {
            operationId: 'msAuthCacheConnectionPublish',
            message: {
              contentType: 'application/json',
              payload: { $ref: '#/components/schemas/MsAuthCacheConnection' },
            },
          },
          subscribe: {
            operationId: 'msAuthCacheConnectionSubscribe',
            message: {
              contentType: 'application/json',
              payload: { $ref: '#/components/schemas/MsAuthCacheConnection' },
            },
          },
        },
        '/ms-auth/cache-user': {
          description: 'When a new connection change occurs the new cache values are emitted in the payload',
          publish: {
            operationId: 'msAuthCacheUserPublish',
            message: { contentType: 'application/json', payload: { $ref: '#/components/schemas/MsAuthCacheUser' } },
          },
          subscribe: {
            operationId: 'msAuthCacheUserSubscribe',
            message: { contentType: 'application/json', payload: { $ref: '#/components/schemas/MsAuthCacheUser' } },
          },
        },
      },
      components: {
        schemas: {
          MsAuthCacheConnection: {
            type: 'object',
            properties: {
              username: { type: 'string' },
              connections: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    updated: { type: 'string', format: 'date' },
                    state: { type: 'string' },
                    username: { type: 'string' },
                  },
                },
              },
            },
          },
          MsAuthCacheUser: { type: 'object', properties: { username: { type: 'string' }, email: { type: 'string' } } },
        },
      },
    });
  });

  it('built builtOA2_std_1.0.1.yml', async () => {
    const infile: any = jsYaml.safeLoad(fs.readFileSync('test-build/builtOA2_std/builtOA2_std_1.0.1.yml', 'utf8'));
    expect(infile).toEqual({
      swagger: '2.0',
      info: {
        version: '1.0.1',
        title: 'boats',
        description: 'A sample API',
        contact: { name: 'Swagger API Team', email: 'john@boats.io', url: 'https://github.com/johndcarmichael/boats/' },
        license: { name: 'Apache 2.0', url: 'https://www.apache.org/licenses/LICENSE-2.0.html' },
      },
      schemes: ['https'],
      host: 'api.example.com',
      basePath: '/v1',
      securityDefinitions: {
        jwtToken: { type: 'apiKey', in: 'header', name: 'authorization' },
        apiKey: { type: 'apiKey', in: 'header', name: 'x-api-key' },
      },
      paths: {
        '/v1/star-wars/': {
          get: {
            tags: ['starWars'],
            summary: 'get star wars details',
            description: 'get star wars details',
            operationId: 'v1StarWarsGet',
            responses: {
              '200': { description: 'Successful fetch', schema: { $ref: '#/definitions/StarWars' } },
              '404': { description: 'Path & method combination not found' },
            },
            security: [{ jwtToken: [] }, { apiKey: [] }],
            parameters: [{ $ref: '#/parameters/HeaderSearchId' }],
          },
        },
        '/weather': {
          get: {
            'tags': ['weather'],
            'summary': 'weather search',
            'description': 'Search for weather objects',
            'operationId': 'v1WeatherGet',
            'x-filename': 'get',
            'parameters': [
              { $ref: '#/parameters/QueryOffset' },
              { $ref: '#/parameters/QueryTextSearch' },
              { $ref: '#/parameters/HeaderSearchId' },
            ],
            'responses': {
              '200': {
                description: 'Successful fetch',
                schema: {
                  properties: {
                    meta: { $ref: '#/definitions/GenericSearchMeta' },
                    data: { type: 'array', items: { $ref: '#/definitions/WeatherModel' } },
                  },
                },
              },
              '404': { description: 'Path & method combination not found' },
            },
            'security': [{ jwtToken: [] }, { apiKey: [] }],
          },
          post: {
            'tags': ['weather'],
            'summary': 'weather data',
            'description': 'Create a new weather record.',
            'operationId': 'v1WeatherPost',
            'parameters': [
              {
                in: 'body',
                name: 'v1WeatherPost',
                description: 'Optional description in *Markdown*',
                required: true,
                schema: { $ref: '#/definitions/WeatherPost' },
              },
              { $ref: '#/parameters/HeaderSearchId' },
            ],
            'responses': {
              '200': { description: 'Successful temp creation', schema: { $ref: '#/definitions/WeatherModel' } },
              '404': { description: 'Path & method combination not found' },
              '422': { description: 'Invalid form data provided' },
            },
            'x-permission': 'createV1Weather',
            'security': [{ jwtToken: [] }, { apiKey: [] }],
          },
        },
        '/weather/id/{id}': {
          get: {
            tags: ['weather'],
            summary: 'One weather object',
            description: 'Get the full weather object',
            operationId: 'v1WeatherIdGet',
            produces: ['application/json'],
            parameters: [{ $ref: '#/parameters/PathId' }, { $ref: '#/parameters/HeaderSearchId' }],
            responses: {
              '200': { description: 'Successful fetch', schema: { $ref: '#/definitions/WeatherModel' } },
              '404': { description: 'Path & method combination not found' },
            },
            security: [{ jwtToken: [] }, { apiKey: [] }],
          },
          delete: {
            'tags': ['weather'],
            'summary': 'weather set to rain',
            'description': 'Reset awful sunny weather to excellent rainy weather',
            'operationId': 'v1WeatherIdDelete',
            'x-filename': 'delete',
            'parameters': [
              { $ref: '#/parameters/PathId' },
              { $ref: '#/parameters/QueryOffset' },
              { $ref: '#/parameters/QueryTextSearch' },
              { in: 'query', name: 'areYouSure', required: true, type: 'string' },
              { in: 'query', name: 'areYouSureSure', required: true, type: 'string' },
              { $ref: '#/parameters/HeaderSearchId' },
            ],
            'responses': {
              '200': { description: 'Deleted' },
              '404': { description: 'Path & method combination not found' },
            },
            'security': [{ jwtToken: [] }, { apiKey: [] }],
          },
          put: {
            tags: ['weather'],
            summary: 'weather data',
            description: 'Create a new weather record.',
            operationId: 'v1WeatherIdPut',
            produces: ['application/json'],
            parameters: [
              { $ref: '#/parameters/PathId' },
              {
                in: 'body',
                name: 'v1WeatherIdPut',
                description: 'Optional description in *Markdown*',
                required: true,
                schema: { $ref: '#/definitions/WeatherIdPut' },
              },
              { $ref: '#/parameters/HeaderSearchId' },
            ],
            responses: {
              '200': { description: 'Successful temp creation', schema: { $ref: '#/definitions/WeatherModel' } },
              '404': { description: 'Path & method combination not found' },
              '422': { description: 'Invalid form data provided' },
            },
            security: [{ jwtToken: [] }, { apiKey: [] }],
          },
        },
        '/weather/id/{id}/pattern': {
          get: {
            tags: ['weather'],
            summary: 'One weather object',
            description: 'Get the full weather object',
            operationId: 'v1WeatherIdPatternGet',
            produces: ['application/json'],
            parameters: [{ $ref: '#/parameters/PathId' }, { $ref: '#/parameters/HeaderSearchId' }],
            responses: {
              '200': { description: 'Successful fetch', schema: { $ref: '#/definitions/WeatherModel' } },
              '404': { description: 'Path & method combination not found' },
            },
            security: [{ jwtToken: [] }, { apiKey: [] }],
          },
        },
        '/weather/latest': {
          get: {
            tags: ['weather'],
            summary: 'lastest weather data',
            description: 'Get the latest temperatures',
            operationId: 'v1WeatherLatestGet',
            produces: ['application/json'],
            responses: {
              '200': { description: 'Successful fetch', schema: { $ref: '#/definitions/WeatherModels' } },
              '404': { description: 'Temp not found' },
            },
            security: [{ jwtToken: [] }],
          },
        },
      },
      parameters: {
        HeaderSearchId: {
          'in': 'header',
          'name': 'Search-Id',
          'type': 'string',
          'description': 'Unique search {id}',
          'x-example': '569eecd9-9962-4aed-a0f0-30476c6a82ed',
        },
        PathId: {
          in: 'path',
          name: 'id',
          type: 'integer',
          required: true,
          description: 'Numeric ID of object to fetch',
        },
        QueryOffset: {
          in: 'query',
          name: 'offset',
          required: false,
          type: 'integer',
          description: 'The number of items to skip before starting to collect the result set.',
        },
        QueryTextSearch: {
          in: 'query',
          name: 'textSearch',
          required: false,
          type: 'string',
          description: 'Search string to query',
        },
      },
      definitions: {
        GenericSearchMeta: {
          properties: { totalResultCount: { type: 'number' }, offset: { type: 'number' }, limit: { type: 'number' } },
        },
        LocationPatch: {
          type: 'object',
          properties: { name: { type: 'string' }, coordinates: { type: 'array', items: { type: 'string' } } },
        },
        LocationPost: {
          type: 'object',
          required: ['name', 'coordinates'],
          properties: { name: { type: 'string' }, coordinates: { type: 'array', items: { type: 'string' } } },
        },
        StarWars: {
          type: 'object',
          properties: {
            empireName: { type: 'string' },
            rebellious: { type: 'boolean' },
            darthVader: { type: 'boolean' },
          },
        },
        WeatherIdPut: {
          allOf: [{ $ref: '#/definitions/WeatherPost' }, { type: 'object', properties: { id: { type: 'integer' } } }],
        },
        WeatherModel: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            date: { type: 'string', format: 'date' },
            location: { type: 'string' },
            cloudCoverPercentage: { type: 'integer' },
            humidityPercentage: { type: 'integer' },
            temperature: { type: 'number' },
          },
        },
        WeatherModels: { type: 'array', items: { $ref: '#/definitions/WeatherModel' } },
        WeatherPost: {
          type: 'object',
          properties: {
            date: { type: 'string', format: 'date' },
            location: { type: 'string' },
            cloudCoverPercentage: { type: 'integer' },
            humidityPercentage: { type: 'integer' },
            temperature: { type: 'number' },
          },
        },
      },
    });
  });

  it('built builtOA2_readonly_1.0.1.yml', async () => {
    const infile: any = jsYaml.safeLoad(
      fs.readFileSync('test-build/builtOA2_readonly/builtOA2_readonly_1.0.1.yml', 'utf8')
    );
    expect(infile).toEqual({
      swagger: '2.0',
      info: {
        version: '1.0.1',
        title: 'boats',
        description: 'A sample API',
        contact: { name: 'Swagger API Team', email: 'john@boats.io', url: 'https://github.com/johndcarmichael/boats/' },
        license: { name: 'Apache 2.0', url: 'https://www.apache.org/licenses/LICENSE-2.0.html' },
      },
      host: 'api.example.com',
      basePath: '/v1',
      schemes: ['https'],
      paths: {
        '/v1/star-wars/': {
          get: {
            tags: ['starWars'],
            summary: 'get star wars details',
            description: 'get star wars details',
            operationId: 'v1StarWarsGet',
            responses: {
              '200': { description: 'Successful fetch', schema: { $ref: '#/definitions/StarWars' } },
              '404': { description: 'Path & method combination not found' },
            },
          },
        },
        '/weather': {
          get: {
            'tags': ['weather'],
            'summary': 'weather search',
            'description': 'Search for weather objects',
            'operationId': 'v1WeatherGet',
            'x-filename': 'get',
            'parameters': [{ $ref: '#/parameters/QueryOffset' }, { $ref: '#/parameters/QueryTextSearch' }],
            'responses': {
              '200': {
                description: 'Successful fetch',
                schema: {
                  properties: {
                    meta: { $ref: '#/definitions/GenericSearchMeta' },
                    data: { type: 'array', items: { $ref: '#/definitions/WeatherModel' } },
                  },
                },
              },
              '404': { description: 'Path & method combination not found' },
            },
          },
        },
        '/weather/id/{id}': {
          get: {
            tags: ['weather'],
            summary: 'One weather object',
            description: 'Get the full weather object',
            operationId: 'v1WeatherIdGet',
            produces: ['application/json'],
            parameters: [{ $ref: '#/parameters/PathId' }],
            responses: {
              '200': { description: 'Successful fetch', schema: { $ref: '#/definitions/WeatherModel' } },
              '404': { description: 'Path & method combination not found' },
            },
          },
          delete: {
            'tags': ['weather'],
            'summary': 'weather set to rain',
            'description': 'Reset awful sunny weather to excellent rainy weather',
            'operationId': 'v1WeatherIdDelete',
            'x-filename': 'delete',
            'parameters': [
              { $ref: '#/parameters/PathId' },
              { $ref: '#/parameters/QueryOffset' },
              { $ref: '#/parameters/QueryTextSearch' },
              { in: 'query', name: 'areYouSure', required: true, type: 'string' },
              { in: 'query', name: 'areYouSureSure', required: true, type: 'string' },
            ],
            'responses': { '200': { description: 'Deleted' }, '404': { description: 'Temp not found' } },
          },
        },
        '/weather/id/{id}/pattern': {
          get: {
            tags: ['weather'],
            summary: 'One weather object',
            description: 'Get the full weather object',
            operationId: 'v1WeatherIdPatternGet',
            produces: ['application/json'],
            parameters: [{ $ref: '#/parameters/PathId' }],
            responses: {
              '200': { description: 'Successful fetch', schema: { $ref: '#/definitions/WeatherModel' } },
              '404': { description: 'Path & method combination not found' },
            },
          },
        },
        '/weather/latest': {
          get: {
            tags: ['weather'],
            summary: 'lastest weather data',
            description: 'Get the latest temperatures',
            operationId: 'v1WeatherLatestGet',
            produces: ['application/json'],
            responses: {
              '200': { description: 'Successful fetch', schema: { $ref: '#/definitions/WeatherModels' } },
              '404': { description: 'Temp not found' },
            },
          },
        },
      },
      parameters: {
        HeaderSearchId: {
          'in': 'header',
          'name': 'Search-Id',
          'type': 'string',
          'description': 'Unique search {id}',
          'x-example': '569eecd9-9962-4aed-a0f0-30476c6a82ed',
        },
        PathId: {
          in: 'path',
          name: 'id',
          type: 'integer',
          required: true,
          description: 'Numeric ID of object to fetch',
        },
        QueryOffset: {
          in: 'query',
          name: 'offset',
          required: false,
          type: 'integer',
          description: 'The number of items to skip before starting to collect the result set.',
        },
        QueryTextSearch: {
          in: 'query',
          name: 'textSearch',
          required: false,
          type: 'string',
          description: 'Search string to query',
        },
      },
      definitions: {
        GenericSearchMeta: {
          properties: { totalResultCount: { type: 'number' }, offset: { type: 'number' }, limit: { type: 'number' } },
        },
        LocationPatch: {
          type: 'object',
          properties: { name: { type: 'string' }, coordinates: { type: 'array', items: { type: 'string' } } },
        },
        LocationPost: {
          type: 'object',
          required: ['name', 'coordinates'],
          properties: { name: { type: 'string' }, coordinates: { type: 'array', items: { type: 'string' } } },
        },
        StarWars: {
          type: 'object',
          properties: {
            empireName: { type: 'string' },
            rebellious: { type: 'boolean' },
            darthVader: { type: 'boolean' },
          },
        },
        WeatherIdPut: {
          allOf: [{ $ref: '#/definitions/WeatherPost' }, { type: 'object', properties: { id: { type: 'integer' } } }],
        },
        WeatherModel: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            date: { type: 'string', format: 'date' },
            location: { type: 'string' },
            cloudCoverPercentage: { type: 'integer' },
            humidityPercentage: { type: 'integer' },
            temperature: { type: 'number' },
          },
        },
        WeatherModels: { type: 'array', items: { $ref: '#/definitions/WeatherModel' } },
        WeatherPost: {
          type: 'object',
          properties: {
            date: { type: 'string', format: 'date' },
            location: { type: 'string' },
            cloudCoverPercentage: { type: 'integer' },
            humidityPercentage: { type: 'integer' },
            temperature: { type: 'number' },
          },
        },
      },
    });
  });

  it('built builtOA2_no_version.yml', async () => {
    const infile: any = jsYaml.safeLoad(
      fs.readFileSync('test-build/builtOA2_no_version/builtOA2_no_version.yml', 'utf8')
    );
    expect(infile).toEqual({
      swagger: '2.0',
      info: {
        version: '1.0.1',
        title: 'boats',
        description: 'A sample API',
        contact: { name: 'Swagger API Team', email: 'john@boats.io', url: 'https://github.com/johndcarmichael/boats/' },
        license: { name: 'Apache 2.0', url: 'https://www.apache.org/licenses/LICENSE-2.0.html' },
      },
      schemes: ['https'],
      host: 'api.example.com',
      basePath: '/v1',
      securityDefinitions: {
        jwtToken: { type: 'apiKey', in: 'header', name: 'authorization' },
        apiKey: { type: 'apiKey', in: 'header', name: 'x-api-key' },
      },
      paths: {
        '/v1/star-wars/': {
          get: {
            tags: ['starWars'],
            summary: 'get star wars details',
            description: 'get star wars details',
            operationId: 'v1StarWarsGet',
            responses: {
              '200': { description: 'Successful fetch', schema: { $ref: '#/definitions/StarWars' } },
              '404': { description: 'Path & method combination not found' },
            },
            security: [{ jwtToken: [] }, { apiKey: [] }],
            parameters: [{ $ref: '#/parameters/HeaderSearchId' }],
          },
        },
        '/weather': {
          get: {
            'tags': ['weather'],
            'summary': 'weather search',
            'description': 'Search for weather objects',
            'operationId': 'v1WeatherGet',
            'x-filename': 'get',
            'parameters': [
              { $ref: '#/parameters/QueryOffset' },
              { $ref: '#/parameters/QueryTextSearch' },
              { $ref: '#/parameters/HeaderSearchId' },
            ],
            'responses': {
              '200': {
                description: 'Successful fetch',
                schema: {
                  properties: {
                    meta: { $ref: '#/definitions/GenericSearchMeta' },
                    data: { type: 'array', items: { $ref: '#/definitions/WeatherModel' } },
                  },
                },
              },
              '404': { description: 'Path & method combination not found' },
            },
            'security': [{ jwtToken: [] }, { apiKey: [] }],
          },
          post: {
            'tags': ['weather'],
            'summary': 'weather data',
            'description': 'Create a new weather record.',
            'operationId': 'v1WeatherPost',
            'parameters': [
              {
                in: 'body',
                name: 'v1WeatherPost',
                description: 'Optional description in *Markdown*',
                required: true,
                schema: { $ref: '#/definitions/WeatherPost' },
              },
              { $ref: '#/parameters/HeaderSearchId' },
            ],
            'responses': {
              '200': { description: 'Successful temp creation', schema: { $ref: '#/definitions/WeatherModel' } },
              '404': { description: 'Path & method combination not found' },
              '422': { description: 'Invalid form data provided' },
            },
            'x-permission': 'createV1Weather',
            'security': [{ jwtToken: [] }, { apiKey: [] }],
          },
        },
        '/weather/id/{id}': {
          get: {
            tags: ['weather'],
            summary: 'One weather object',
            description: 'Get the full weather object',
            operationId: 'v1WeatherIdGet',
            produces: ['application/json'],
            parameters: [{ $ref: '#/parameters/PathId' }, { $ref: '#/parameters/HeaderSearchId' }],
            responses: {
              '200': { description: 'Successful fetch', schema: { $ref: '#/definitions/WeatherModel' } },
              '404': { description: 'Path & method combination not found' },
            },
            security: [{ jwtToken: [] }, { apiKey: [] }],
          },
          delete: {
            'tags': ['weather'],
            'summary': 'weather set to rain',
            'description': 'Reset awful sunny weather to excellent rainy weather',
            'operationId': 'v1WeatherIdDelete',
            'x-filename': 'delete',
            'parameters': [
              { $ref: '#/parameters/PathId' },
              { $ref: '#/parameters/QueryOffset' },
              { $ref: '#/parameters/QueryTextSearch' },
              { in: 'query', name: 'areYouSure', required: true, type: 'string' },
              { in: 'query', name: 'areYouSureSure', required: true, type: 'string' },
              { $ref: '#/parameters/HeaderSearchId' },
            ],
            'responses': {
              '200': { description: 'Deleted' },
              '404': { description: 'Path & method combination not found' },
            },
            'security': [{ jwtToken: [] }, { apiKey: [] }],
          },
          put: {
            tags: ['weather'],
            summary: 'weather data',
            description: 'Create a new weather record.',
            operationId: 'v1WeatherIdPut',
            produces: ['application/json'],
            parameters: [
              { $ref: '#/parameters/PathId' },
              {
                in: 'body',
                name: 'v1WeatherIdPut',
                description: 'Optional description in *Markdown*',
                required: true,
                schema: { $ref: '#/definitions/WeatherIdPut' },
              },
              { $ref: '#/parameters/HeaderSearchId' },
            ],
            responses: {
              '200': { description: 'Successful temp creation', schema: { $ref: '#/definitions/WeatherModel' } },
              '404': { description: 'Path & method combination not found' },
              '422': { description: 'Invalid form data provided' },
            },
            security: [{ jwtToken: [] }, { apiKey: [] }],
          },
        },
        '/weather/id/{id}/pattern': {
          get: {
            tags: ['weather'],
            summary: 'One weather object',
            description: 'Get the full weather object',
            operationId: 'v1WeatherIdPatternGet',
            produces: ['application/json'],
            parameters: [{ $ref: '#/parameters/PathId' }, { $ref: '#/parameters/HeaderSearchId' }],
            responses: {
              '200': { description: 'Successful fetch', schema: { $ref: '#/definitions/WeatherModel' } },
              '404': { description: 'Path & method combination not found' },
            },
            security: [{ jwtToken: [] }, { apiKey: [] }],
          },
        },
        '/weather/latest': {
          get: {
            tags: ['weather'],
            summary: 'lastest weather data',
            description: 'Get the latest temperatures',
            operationId: 'v1WeatherLatestGet',
            produces: ['application/json'],
            responses: {
              '200': { description: 'Successful fetch', schema: { $ref: '#/definitions/WeatherModels' } },
              '404': { description: 'Temp not found' },
            },
            security: [{ jwtToken: [] }],
          },
        },
      },
      parameters: {
        HeaderSearchId: {
          'in': 'header',
          'name': 'Search-Id',
          'type': 'string',
          'description': 'Unique search {id}',
          'x-example': '569eecd9-9962-4aed-a0f0-30476c6a82ed',
        },
        PathId: {
          in: 'path',
          name: 'id',
          type: 'integer',
          required: true,
          description: 'Numeric ID of object to fetch',
        },
        QueryOffset: {
          in: 'query',
          name: 'offset',
          required: false,
          type: 'integer',
          description: 'The number of items to skip before starting to collect the result set.',
        },
        QueryTextSearch: {
          in: 'query',
          name: 'textSearch',
          required: false,
          type: 'string',
          description: 'Search string to query',
        },
      },
      definitions: {
        GenericSearchMeta: {
          properties: { totalResultCount: { type: 'number' }, offset: { type: 'number' }, limit: { type: 'number' } },
        },
        LocationPatch: {
          type: 'object',
          properties: { name: { type: 'string' }, coordinates: { type: 'array', items: { type: 'string' } } },
        },
        LocationPost: {
          type: 'object',
          required: ['name', 'coordinates'],
          properties: { name: { type: 'string' }, coordinates: { type: 'array', items: { type: 'string' } } },
        },
        StarWars: {
          type: 'object',
          properties: {
            empireName: { type: 'string' },
            rebellious: { type: 'boolean' },
            darthVader: { type: 'boolean' },
          },
        },
        WeatherIdPut: {
          allOf: [{ $ref: '#/definitions/WeatherPost' }, { type: 'object', properties: { id: { type: 'integer' } } }],
        },
        WeatherModel: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            date: { type: 'string', format: 'date' },
            location: { type: 'string' },
            cloudCoverPercentage: { type: 'integer' },
            humidityPercentage: { type: 'integer' },
            temperature: { type: 'number' },
          },
        },
        WeatherModels: { type: 'array', items: { $ref: '#/definitions/WeatherModel' } },
        WeatherPost: {
          type: 'object',
          properties: {
            date: { type: 'string', format: 'date' },
            location: { type: 'string' },
            cloudCoverPercentage: { type: 'integer' },
            humidityPercentage: { type: 'integer' },
            temperature: { type: 'number' },
          },
        },
      },
    });
  });

  it('built builtOA3_1.0.1.yml', async () => {
    const infile: any = jsYaml.safeLoad(fs.readFileSync('test-build/builtOA3_std/builtOA3_1.0.1.yml', 'utf8'));
    expect(infile).toEqual({
      openapi: '3.0.0',
      info: {
        version: '1.0.1',
        title: 'boats',
        description: 'A sample API',
        contact: { name: 'Swagger API Team', email: 'john@boats.io', url: 'https://github.com/johndcarmichael/boats/' },
        license: { name: 'Apache 2.0', url: 'https://www.apache.org/licenses/LICENSE-2.0.html' },
      },
      servers: [{ url: 'localhost' }],
      tags: [{ name: 'weather', description: 'Weather data' }],
      paths: {
        '/weather': {
          get: {
            tags: ['Weather'],
            summary: 'weather data',
            description: 'Get the latest temperatures',
            operationId: 'weatherGet',
            responses: {
              '200': {
                description: 'Successful fetch',
                content: { 'application/json': { schema: { $ref: '#/components/schemas/Weathers' } } },
              },
              '404': { description: 'Temp not found' },
            },
          },
          post: {
            tags: ['Weather'],
            summary: 'weather data',
            description: 'Create a new weather record.',
            operationId: 'weatherPost',
            requestBody: {
              description: 'Optional description in *Markdown*',
              required: true,
              content: { 'application/json': { schema: { $ref: '#/components/schemas/WeatherPost' } } },
            },
            responses: {
              '200': {
                description: 'Successful temp creation',
                content: { 'application/json': { schema: { $ref: '#/components/schemas/Weather' } } },
              },
              '422': { description: 'Invalid form data provided' },
            },
          },
        },
        '/weather/id/{id}': {
          get: {
            tags: ['Weather'],
            summary: 'weather data',
            description: 'Get the latest temperatures',
            operationId: 'weatherIdIdGet',
            parameters: [{ $ref: '#/components/parameters/PathId' }],
            responses: {
              '200': {
                description: 'Successful fetch',
                content: { 'application/json': { schema: { $ref: '#/components/schemas/Weather' } } },
              },
              '404': { description: 'Temp not found' },
            },
          },
          put: {
            tags: ['Weather'],
            summary: 'weather data',
            description: 'Create a new weather record.',
            operationId: 'weatherIdIdPut',
            requestBody: {
              description: 'Optional description in *Markdown*',
              required: true,
              content: { 'application/json': { schema: { $ref: '#/components/schemas/WeatherPut' } } },
            },
            responses: {
              '200': {
                description: 'Successful temp creation',
                content: { 'application/json': { schema: { $ref: '#/components/schemas/Weather' } } },
              },
              '422': { description: 'Invalid form data provided' },
            },
          },
        },
      },
      components: {
        parameters: {
          PathId: {
            in: 'path',
            name: 'id',
            schema: { type: 'integer' },
            required: true,
            description: 'Numeric ID of object to fetch',
          },
          QueryOffset: {
            in: 'query',
            name: 'offset',
            required: false,
            schema: { type: 'integer', minimum: 0 },
            description: 'The number of items to skip before starting to collect the result set.',
          },
        },
        schemas: {
          GenericSearchMeta: {
            properties: { totalResultCount: { type: 'number' }, offset: { type: 'number' }, limit: { type: 'number' } },
          },
          LocationPatch: {
            type: 'object',
            properties: { name: { type: 'string' }, coordinates: { type: 'array', items: { type: 'string' } } },
          },
          LocationPost: {
            type: 'object',
            required: ['name', 'coordinates'],
            properties: { name: { type: 'string' }, coordinates: { type: 'array', items: { type: 'string' } } },
          },
          LocationPut: {
            allOf: [
              {
                type: 'object',
                properties: { name: { type: 'string' }, coordinates: { type: 'array', items: { type: 'string' } } },
              },
              {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  location: {
                    allOf: [
                      {
                        type: 'object',
                        properties: {
                          name: { type: 'string' },
                          coordinates: { type: 'array', items: { type: 'string' } },
                        },
                      },
                    ],
                  },
                },
              },
            ],
          },
          Weather: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              date: { type: 'string', format: 'date' },
              location: { type: 'string' },
              cloudCoverPercentage: { type: 'integer' },
              humidityPercentage: { type: 'integer' },
              temperature: { type: 'number' },
            },
          },
          Weathers: {
            type: 'object',
            properties: {
              meta: { $ref: '#/components/schemas/GenericSearchMeta' },
              data: { type: 'array', items: { $ref: '#/components/schemas/Weather' } },
            },
          },
          WeatherPost: {
            type: 'object',
            properties: {
              date: { type: 'string', format: 'date' },
              location: { type: 'string' },
              cloudCoverPercentage: { type: 'integer' },
              humidityPercentage: { type: 'integer' },
              temperature: { type: 'number' },
            },
          },
          WeatherPut: {
            allOf: [
              { $ref: '#/components/schemas/WeatherPost' },
              { type: 'object', properties: { id: { type: 'integer' } } },
            ],
          },
        },
      },
    });
  });

  it('built builtOA3.yml', async () => {
    const infile: any = jsYaml.safeLoad(fs.readFileSync('test-build/builtOA3_exclude/builtOA3.yml', 'utf8'));
    expect(infile).toEqual({
      openapi: '3.0.0',
      info: {
        version: '1.0.1',
        title: 'boats',
        description: 'A sample API',
        contact: { name: 'Swagger API Team', email: 'john@boats.io', url: 'https://github.com/johndcarmichael/boats/' },
        license: { name: 'Apache 2.0', url: 'https://www.apache.org/licenses/LICENSE-2.0.html' },
      },
      servers: [{ url: 'localhost' }],
      tags: [{ name: 'weather', description: 'Weather data' }],
      paths: {
        '/weather': {
          get: {
            tags: ['Weather'],
            summary: 'weather data',
            description: 'Get the latest temperatures',
            operationId: 'weatherGet',
            responses: {
              '200': {
                description: 'Successful fetch',
                content: { 'application/json': { schema: { $ref: '#/components/schemas/Weathers' } } },
              },
              '404': { description: 'Temp not found' },
            },
          },
          post: {
            tags: ['Weather'],
            summary: 'weather data',
            description: 'Create a new weather record.',
            operationId: 'weatherPost',
            requestBody: {
              description: 'Optional description in *Markdown*',
              required: true,
              content: { 'application/json': { schema: { $ref: '#/components/schemas/WeatherPost' } } },
            },
            responses: {
              '200': {
                description: 'Successful temp creation',
                content: { 'application/json': { schema: { $ref: '#/components/schemas/Weather' } } },
              },
              '422': { description: 'Invalid form data provided' },
            },
          },
        },
        '/weather/id/{id}': {
          get: {
            tags: ['Weather'],
            summary: 'weather data',
            description: 'Get the latest temperatures',
            operationId: 'weatherIdIdGet',
            parameters: [{ $ref: '#/components/parameters/PathId' }],
            responses: {
              '200': {
                description: 'Successful fetch',
                content: { 'application/json': { schema: { $ref: '#/components/schemas/Weather' } } },
              },
              '404': { description: 'Temp not found' },
            },
          },
          put: {
            tags: ['Weather'],
            summary: 'weather data',
            description: 'Create a new weather record.',
            operationId: 'weatherIdIdPut',
            requestBody: {
              description: 'Optional description in *Markdown*',
              required: true,
              content: { 'application/json': { schema: { $ref: '#/components/schemas/WeatherPut' } } },
            },
            responses: {
              '200': {
                description: 'Successful temp creation',
                content: { 'application/json': { schema: { $ref: '#/components/schemas/Weather' } } },
              },
              '422': { description: 'Invalid form data provided' },
            },
          },
        },
      },
      components: {
        parameters: {
          PathId: {
            in: 'path',
            name: 'id',
            schema: { type: 'integer' },
            required: true,
            description: 'Numeric ID of object to fetch',
          },
          QueryOffset: {
            in: 'query',
            name: 'offset',
            required: false,
            schema: { type: 'integer', minimum: 0 },
            description: 'The number of items to skip before starting to collect the result set.',
          },
        },
        schemas: {
          GenericSearchMeta: {
            properties: { totalResultCount: { type: 'number' }, offset: { type: 'number' }, limit: { type: 'number' } },
          },
          LocationPatch: {
            type: 'object',
            properties: { name: { type: 'string' }, coordinates: { type: 'array', items: { type: 'string' } } },
          },
          LocationPost: {
            type: 'object',
            required: ['name', 'coordinates'],
            properties: { name: { type: 'string' }, coordinates: { type: 'array', items: { type: 'string' } } },
          },
          LocationPut: {
            allOf: [
              {
                type: 'object',
                properties: { name: { type: 'string' }, coordinates: { type: 'array', items: { type: 'string' } } },
              },
              {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  location: {
                    allOf: [
                      {
                        type: 'object',
                        properties: {
                          name: { type: 'string' },
                          coordinates: { type: 'array', items: { type: 'string' } },
                        },
                      },
                    ],
                  },
                },
              },
            ],
          },
          Weather: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              date: { type: 'string', format: 'date' },
              location: { type: 'string' },
              cloudCoverPercentage: { type: 'integer' },
              humidityPercentage: { type: 'integer' },
              temperature: { type: 'number' },
            },
          },
          Weathers: {
            type: 'object',
            properties: {
              meta: { $ref: '#/components/schemas/GenericSearchMeta' },
              data: { type: 'array', items: { $ref: '#/components/schemas/Weather' } },
            },
          },
          WeatherPost: {
            type: 'object',
            properties: {
              date: { type: 'string', format: 'date' },
              location: { type: 'string' },
              cloudCoverPercentage: { type: 'integer' },
              humidityPercentage: { type: 'integer' },
              temperature: { type: 'number' },
            },
          },
          WeatherPut: {
            allOf: [
              { $ref: '#/components/schemas/WeatherPost' },
              { type: 'object', properties: { id: { type: 'integer' } } },
            ],
          },
        },
      },
    });
  });

  it('built test-build/builtOA2_inject/api_1.0.1.yml', async () => {
    const infile: any = jsYaml.safeLoad(fs.readFileSync('test-build/builtOA2_inject/api_1.0.1.yml', 'utf8'));
    expect(infile).toEqual({
      swagger: '2.0',
      info: {
        version: '1.0.1',
        title: 'boats',
        description: 'A sample API',
        contact: { name: 'Swagger API Team', email: 'john@boats.io', url: 'https://github.com/johndcarmichael/boats/' },
        license: { name: 'Apache 2.0', url: 'https://www.apache.org/licenses/LICENSE-2.0.html' },
      },
      schemes: ['https'],
      host: 'api.example.com',
      basePath: '/v1',
      securityDefinitions: {
        jwtToken: { type: 'apiKey', in: 'header', name: 'authorization' },
        apiKey: { type: 'apiKey', in: 'header', name: 'x-api-key' },
      },
      paths: {
        '/v1/star-wars/': {
          get: {
            'tags': ['starWars'],
            'summary': 'get star wars details',
            'description': 'get star wars details',
            'operationId': 'v1StarWarsGet',
            'responses': {
              '200': { description: 'Successful fetch', schema: { $ref: '#/definitions/StarWars' } },
              '404': { description: 'Path & method combination not found' },
            },
            'security': [{ jwtToken: [] }, { apiKey: [] }],
            'x-permission': 'readV1StarWars',
            'parameters': [{ $ref: '#/parameters/HeaderSearchId' }],
            'x-autoTag': 'V1',
            'x-fileName': 'get',
            'x-uniqueOpId': 'v1StarWarsGet',
            'x-template-permission': 'readV1StarWarsGet',
            'x-template-description': 'v1StarWarsGet',
            'x-template-resolution': {
              a: { $ref: '#/parameters/HeaderSearchId' },
              b: { $ref: '#/parameters/HeaderSearchId' },
              c: { $ref: '#/parameters/HeaderSearchId' },
            },
            'x-json-content-test': 'v1StarWarsGet',
          },
        },
        '/weather': {
          get: {
            'tags': ['weather'],
            'summary': 'weather search',
            'description': 'Search for weather objects',
            'operationId': 'v1WeatherGet',
            'x-filename': 'get',
            'parameters': [
              { $ref: '#/parameters/QueryOffset' },
              { $ref: '#/parameters/QueryTextSearch' },
              { $ref: '#/parameters/HeaderSearchId' },
            ],
            'responses': {
              '200': {
                description: 'Successful fetch',
                schema: {
                  properties: {
                    meta: { $ref: '#/definitions/GenericSearchMeta' },
                    data: { type: 'array', items: { $ref: '#/definitions/WeatherModel' } },
                  },
                },
              },
              '404': { description: 'Path & method combination not found' },
            },
            'security': [{ jwtToken: [] }, { apiKey: [] }],
            'x-permission': 'readV1Weather',
            'x-autoTag': 'V1',
            'x-fileName': 'get',
            'x-uniqueOpId': 'v1WeatherGet',
            'x-template-permission': 'readV1WeatherGet',
            'x-template-description': 'v1WeatherGet',
            'x-template-resolution': {
              a: { $ref: '#/parameters/HeaderSearchId' },
              b: { $ref: '#/parameters/HeaderSearchId' },
              c: { $ref: '#/parameters/HeaderSearchId' },
            },
            'x-json-content-test': 'v1WeatherGet',
          },
          post: {
            'tags': ['weather'],
            'summary': 'weather data',
            'description': 'Create a new weather record.',
            'operationId': 'v1WeatherPost',
            'parameters': [
              {
                in: 'body',
                name: 'v1WeatherPost',
                description: 'Optional description in *Markdown*',
                required: true,
                schema: { $ref: '#/definitions/WeatherPost' },
              },
            ],
            'responses': {
              '200': { description: 'Successful temp creation', schema: { $ref: '#/definitions/WeatherModel' } },
              '422': { description: 'Invalid form data provided' },
            },
            'x-permission': 'createV1Weather',
            'security': [{ jwtToken: [] }],
            'x-autoTag': 'V1',
            'x-fileName': 'post',
            'x-uniqueOpId': 'v1WeatherPost',
            'x-template-permission': 'createV1WeatherPost',
            'x-template-description': 'v1WeatherPost',
            'x-template-resolution': {
              a: { $ref: '#/parameters/HeaderSearchId' },
              b: { $ref: '#/parameters/HeaderSearchId' },
              c: { $ref: '#/parameters/HeaderSearchId' },
            },
            'x-json-content-test': 'v1WeatherPost',
          },
        },
        '/weather/id/{id}': {
          get: {
            'tags': ['weather'],
            'summary': 'One weather object',
            'description': 'Get the full weather object',
            'operationId': 'v1WeatherIdGet',
            'produces': ['application/json'],
            'parameters': [{ $ref: '#/parameters/PathId' }, { $ref: '#/parameters/HeaderSearchId' }],
            'responses': {
              '200': { description: 'Successful fetch', schema: { $ref: '#/definitions/WeatherModel' } },
              '404': { description: 'Path & method combination not found' },
            },
            'security': [{ jwtToken: [] }, { apiKey: [] }],
            'x-permission': 'readV1WeatherId',
            'x-autoTag': 'V1',
            'x-fileName': 'get',
            'x-uniqueOpId': 'v1WeatherIdGet',
            'x-template-permission': 'readV1WeatherIdGet',
            'x-template-description': 'v1WeatherIdGet',
            'x-template-resolution': {
              a: { $ref: '#/parameters/HeaderSearchId' },
              b: { $ref: '#/parameters/HeaderSearchId' },
              c: { $ref: '#/parameters/HeaderSearchId' },
            },
            'x-json-content-test': 'v1WeatherIdGet',
          },
          delete: {
            'tags': ['weather'],
            'summary': 'weather set to rain',
            'description': 'Reset awful sunny weather to excellent rainy weather',
            'operationId': 'v1WeatherIdDelete',
            'x-filename': 'delete',
            'parameters': [
              { $ref: '#/parameters/PathId' },
              { $ref: '#/parameters/QueryOffset' },
              { $ref: '#/parameters/QueryTextSearch' },
              { in: 'query', name: 'areYouSure', required: true, type: 'string' },
              { in: 'query', name: 'areYouSureSure', required: true, type: 'string' },
            ],
            'responses': { '200': { description: 'Deleted' }, '404': { description: 'Temp not found' } },
            'security': [{ jwtToken: [] }],
            'x-permission': 'deleteV1WeatherId',
            'x-autoTag': 'V1',
            'x-fileName': 'delete',
            'x-uniqueOpId': 'v1WeatherIdDelete',
            'x-template-permission': 'deleteV1WeatherIdDelete',
            'x-template-description': 'v1WeatherIdDelete',
            'x-template-resolution': {
              a: { $ref: '#/parameters/HeaderSearchId' },
              b: { $ref: '#/parameters/HeaderSearchId' },
              c: { $ref: '#/parameters/HeaderSearchId' },
            },
            'x-json-content-test': 'v1WeatherIdDelete',
          },
          put: {
            'tags': ['weather'],
            'summary': 'weather data',
            'description': 'Create a new weather record.',
            'operationId': 'v1WeatherIdPut',
            'produces': ['application/json'],
            'parameters': [
              { $ref: '#/parameters/PathId' },
              {
                in: 'body',
                name: 'v1WeatherIdPut',
                description: 'Optional description in *Markdown*',
                required: true,
                schema: { $ref: '#/definitions/WeatherIdPut' },
              },
            ],
            'responses': {
              '200': { description: 'Successful temp creation', schema: { $ref: '#/definitions/WeatherModel' } },
              '422': { description: 'Invalid form data provided' },
            },
            'security': [{ jwtToken: [] }],
            'x-permission': 'updateV1WeatherId',
            'x-autoTag': 'V1',
            'x-fileName': 'put',
            'x-uniqueOpId': 'v1WeatherIdPut',
            'x-template-permission': 'updateV1WeatherIdPut',
            'x-template-description': 'v1WeatherIdPut',
            'x-template-resolution': {
              a: { $ref: '#/parameters/HeaderSearchId' },
              b: { $ref: '#/parameters/HeaderSearchId' },
              c: { $ref: '#/parameters/HeaderSearchId' },
            },
            'x-json-content-test': 'v1WeatherIdPut',
          },
        },
        '/weather/id/{id}/pattern': {
          get: {
            'tags': ['weather'],
            'summary': 'One weather object',
            'description': 'Get the full weather object',
            'operationId': 'v1WeatherIdPatternGet',
            'produces': ['application/json'],
            'parameters': [{ $ref: '#/parameters/PathId' }, { $ref: '#/parameters/HeaderSearchId' }],
            'responses': {
              '200': { description: 'Successful fetch', schema: { $ref: '#/definitions/WeatherModel' } },
              '404': { description: 'Path & method combination not found' },
            },
            'security': [{ jwtToken: [] }, { apiKey: [] }],
            'x-permission': 'readV1WeatherIdPattern',
            'x-autoTag': 'V1',
            'x-fileName': 'get',
            'x-uniqueOpId': 'v1WeatherIdPatternGet',
            'x-template-permission': 'readV1WeatherIdPatternGet',
            'x-template-description': 'v1WeatherIdPatternGet',
            'x-template-resolution': {
              a: { $ref: '#/parameters/HeaderSearchId' },
              b: { $ref: '#/parameters/HeaderSearchId' },
              c: { $ref: '#/parameters/HeaderSearchId' },
            },
            'x-json-content-test': 'v1WeatherIdPatternGet',
          },
        },
        '/weather/latest': {
          get: {
            'tags': ['weather'],
            'summary': 'lastest weather data',
            'description': 'Get the latest temperatures',
            'operationId': 'v1WeatherLatestGet',
            'produces': ['application/json'],
            'responses': {
              '200': { description: 'Successful fetch', schema: { $ref: '#/definitions/WeatherModels' } },
              '404': { description: 'Temp not found' },
            },
            'security': [{ jwtToken: [] }],
            'x-permission': 'readV1WeatherLatest',
            'x-autoTag': 'V1',
            'x-fileName': 'get',
            'x-uniqueOpId': 'v1WeatherLatestGet',
            'x-template-permission': 'readV1WeatherLatestGet',
            'x-template-description': 'v1WeatherLatestGet',
            'x-template-resolution': {
              a: { $ref: '#/parameters/HeaderSearchId' },
              b: { $ref: '#/parameters/HeaderSearchId' },
              c: { $ref: '#/parameters/HeaderSearchId' },
            },
            'x-json-content-test': 'v1WeatherLatestGet',
          },
        },
      },
      parameters: {
        HeaderSearchId: {
          'in': 'header',
          'name': 'Search-Id',
          'type': 'string',
          'description': 'Unique search {id}',
          'x-example': '569eecd9-9962-4aed-a0f0-30476c6a82ed',
        },
        PathId: {
          in: 'path',
          name: 'id',
          type: 'integer',
          required: true,
          description: 'Numeric ID of object to fetch',
        },
        QueryOffset: {
          in: 'query',
          name: 'offset',
          required: false,
          type: 'integer',
          description: 'The number of items to skip before starting to collect the result set.',
        },
        QueryTextSearch: {
          in: 'query',
          name: 'textSearch',
          required: false,
          type: 'string',
          description: 'Search string to query',
        },
      },
      definitions: {
        GenericSearchMeta: {
          properties: { totalResultCount: { type: 'number' }, offset: { type: 'number' }, limit: { type: 'number' } },
        },
        LocationPatch: {
          type: 'object',
          properties: { name: { type: 'string' }, coordinates: { type: 'array', items: { type: 'string' } } },
        },
        LocationPost: {
          type: 'object',
          required: ['name', 'coordinates'],
          properties: { name: { type: 'string' }, coordinates: { type: 'array', items: { type: 'string' } } },
        },
        StarWars: {
          type: 'object',
          properties: {
            empireName: { type: 'string' },
            rebellious: { type: 'boolean' },
            darthVader: { type: 'boolean' },
          },
        },
        WeatherIdPut: {
          allOf: [{ $ref: '#/definitions/WeatherPost' }, { type: 'object', properties: { id: { type: 'integer' } } }],
        },
        WeatherModel: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            date: { type: 'string', format: 'date' },
            location: { type: 'string' },
            cloudCoverPercentage: { type: 'integer' },
            humidityPercentage: { type: 'integer' },
            temperature: { type: 'number' },
          },
        },
        WeatherModels: { type: 'array', items: { $ref: '#/definitions/WeatherModel' } },
        WeatherPost: {
          type: 'object',
          properties: {
            date: { type: 'string', format: 'date' },
            location: { type: 'string' },
            cloudCoverPercentage: { type: 'integer' },
            humidityPercentage: { type: 'integer' },
            temperature: { type: 'number' },
          },
        },
      },
    });
  });
});
