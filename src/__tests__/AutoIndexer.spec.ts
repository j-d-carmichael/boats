import AutoIndexer from '@/AutoIndexer';
import { BoatsRC } from '@/interfaces/BoatsRc';

const boatsRcDummyObject: BoatsRC = {
  picomatchOptions: {},
  nunjucksOptions: {},
  permissionConfig: {}
};

describe('createChannelString', () => {
  it('should return without the ext but with the / as a sep', async () => {
    const output = AutoIndexer.createChannelString(
      boatsRcDummyObject,
      '/domains/RoleNameDomain.yml'
    );
    expect(output).toEqual('/domains/RoleNameDomain');
  });

  it('should return without the ext but with the . as a sep', async () => {
    const output = AutoIndexer.createChannelString(
      boatsRcDummyObject,
      '/domains/RoleNameDomain.yml',
      {
        channelSeparators: [{
          match: '/domains/**',
          separator: '.'
        }]
      }
    );
    expect(output).toEqual('domains.RoleNameDomain');
  });

  it('should return without the ext but with the . as a sep but with a deeper path', async () => {
    const output = AutoIndexer.createChannelString(
      boatsRcDummyObject,
      '/domains/RoleNameDomain/Bob/Thing.yml',
      {
        channelSeparators: [{
          match: '/domains/**',
          separator: '.'
        }]
      }
    );
    expect(output).toEqual('domains.RoleNameDomain.Bob.Thing');
  });

  it('should return without the ext but with the / as a sep even though there is a pico match', async () => {
    const output = AutoIndexer.createChannelString(
      boatsRcDummyObject,
      '/domain/RoleNameDomain/Bob/Thing.yml',
      {
        channelSeparators: [{
          match: '/domains/**',
          separator: '.'
        }]
      }
    );
    expect(output).toEqual('/domain/RoleNameDomain/Bob/Thing');
  });

  it('should return without the ext but with the . as a sep on a complete wildcard', async () => {
    const output = AutoIndexer.createChannelString(
      boatsRcDummyObject,
      '/domain/RoleNameDomain/Bob/Thing.yml',
      {
        channelSeparators: [{
          match: '**',
          separator: '.'
        }]
      }
    );
    expect(output).toEqual('domain.RoleNameDomain.Bob.Thing');
  });
});
