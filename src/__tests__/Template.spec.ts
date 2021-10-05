import Template from '../Template';
import _ from 'lodash';
import upath from 'upath';

const string1 = `
Weather: mixin('some/path', 321)

Weathers: mixin('some/pther/path', 654654)
`;

const string2 = `
Weather:
  object: mixin('some/path', 321)

Weathers:
  object: mixin('some/other/path', 654654)
`;
describe('setMixinPositions', () => {
  it('match simple mixin', () => {
    const response = JSON.stringify(Template.setMixinPositions(string1, 2));
    expect(response).toBe(
      JSON.stringify([
        {
          index: 33,
          match: "mixin('some/path', 321)",
          mixinPath: "some/path",
          mixinLinePadding: '  ',
        },
        {
          index: 77,
          match: "mixin('some/pther/path', 654654)",
          mixinPath: "some/pther/path",
          mixinLinePadding: '  ',
        },
      ])
    );
  });

  it('match nested mixin', () => {
    const response = JSON.stringify(Template.setMixinPositions(string2, 2));
    expect(response).toBe(
      JSON.stringify([
        {
          index: 43,
          match: "mixin('some/path', 321)",
          mixinPath: "some/path",
          mixinLinePadding: '  ',
        },
        {
          index: 97,
          match: "mixin('some/other/path', 654654)",
          mixinPath: "some/other/path",
          mixinLinePadding: '  ',
        },
      ])
    );
  });
});

describe('stripNjkExtension', () => {
  it('should remove the ext', function () {
    expect(Template.stripNjkExtension('/some/path/helpers/myCoolHelper.js.njk')).toBe(
      '/some/path/helpers/myCoolHelper.js'
    );
  });
  it('should return plain', function () {
    expect(Template.stripNjkExtension('/some/path/helpers/myCoolHelper.js')).toBe('/some/path/helpers/myCoolHelper.js');
  });
});

describe('getHelperFunctionNameFromPath', () => {
  it('should return untouched a valid string', () => {
    expect(Template.getHelperFunctionNameFromPath('/some/path/helpers/myCoolHelper.js')).toBe('myCoolHelper');
  });

  it('should strip out non (alpha numeric _ )chars', () => {
    expect(Template.getHelperFunctionNameFromPath('/some/path/helpers/my-Cool$Helper!_.js')).toBe('myCoolHelper_');
  });
});

describe('setDefaultStripValue', () => {
  it('should return src/paths/', () => {
    expect(Template.setDefaultStripValue(undefined, 'swagger file thing more words')).toBe('src/paths/');
  });

  it('should return src/paths/', () => {
    expect(Template.setDefaultStripValue(undefined, 'openapi file thing more words')).toBe('src/paths/');
  });

  it('should return src/channels/', () => {
    expect(Template.setDefaultStripValue(undefined, 'asyncapi file thing more words')).toBe('src/channels/');
  });

  it('should throw error', (done) => {
    try {
      Template.setDefaultStripValue(undefined, 'file thing more words');
      done('Should have thrown an error');
    } catch (e) {
      done();
    }
  });
});

describe('nunjucksSetup', () => {
  let mockEnv: Record<string, any>;
  let mockTsNode: any;
  let template: typeof Template;

  beforeEach(() => {
    jest.resetModules();

    mockEnv = {
      addGlobal(k: any, v: any) {
        this[k] = v;
      }
    };

    jest.mock('nunjucks', () => ({
      configure: () => mockEnv
    }));

    mockTsNode = {
      register: jest.fn()
    };

    jest.mock('ts-node', () => mockTsNode);

    template = jest.requireActual('../Template').default;
    template.inputFile = 'test.yml';
    template.helpFunctionPaths = [];
    template.boatsrc = {
      nunjucksOptions: { beep: 'boop' }
    };
  });

  afterEach(() => {
    jest.resetModules();
  });

  it('copies process.env variables to nunjucks env', () => {
    template.nunjucksSetup();

    for (const envKey in process.env) {
      expect(mockEnv[envKey]).toBeDefined();
    }
  });

  it('defines default helpers', () => {
    template.nunjucksSetup();

    const internalHelpersNames = [
      'mixinNumber',
      'mixinObject',
      'indentNumber',
      'indentObject',
      'mixinVarNamePrefix',
      'currentFilePointer'
    ];

    for (const name of internalHelpersNames) {
      expect(mockEnv[name]).toEqual((template as any)[name]);
    }

    const importedFnNames = [
      'autoChannelIndexer',
      'autoComponentIndexer',
      'autoPathIndexer',
      'schemaRef',
      'autoTag',
      'fileName',
      'inject',
      'optionalProps',
      'merge',
      'mixin',
      'routePermission',
      'uniqueOpId',
      'packageJson'
    ];

    for (const name of importedFnNames) {
      expect(mockEnv[name]).toEqual(expect.any(Function));
    }

    expect(mockEnv.boatsConfig).toEqual(template.boatsrc);
    expect(mockEnv.pathInjector).toBeDefined();
    expect(mockEnv.uniqueOpIdStripValue).toEqual(template.stripValue);
    expect(mockEnv._.VERSION).toEqual(_.VERSION);
  });

  it('loads external helper from file - javascript', () => {
    template.helpFunctionPaths = [
      upath.normalize(`${__dirname}/testHelpers/exampleJsHelper.js`)
    ];

    template.nunjucksSetup();
    expect(mockEnv.exampleJsHelper.name).toBe('exampleJsHelper');
  });

  it('loads external helper from file - typescript', () => {
    template.helpFunctionPaths = [
      upath.normalize(`${__dirname}/testHelpers/exampleTsHelper.ts`)
    ];

    template.nunjucksSetup();

    expect(mockTsNode.register).toBeCalled();
    expect(mockEnv.exampleTsHelper.name).toBe('exampleTsHelper');
  });
});
