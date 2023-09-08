import buildIndexFromPath from '@/utils/buildIndexFromPath';

describe('glob check', () => {
  it('it does dumb pluralization without trim', () => {
    expect(buildIndexFromPath({ cleanPath: 'university/model.yml' })).toEqual('UniversityModel');
    expect(buildIndexFromPath({ cleanPath: 'university/models.yml' })).toEqual('UniversityModels');
  });

  it('it does dumb pluralization with trim', () => {
    expect(buildIndexFromPath({ cleanPath: 'university/model.yml', autoComponentIndexerOptions: 'Model' })).toEqual('University');
    expect(buildIndexFromPath({ cleanPath: 'university/models.yml', autoComponentIndexerOptions: 'Model' })).toEqual('Universitys');
  });

  it('it does dumb pluralization and only replaces last trim occurence ', () => {
    expect(buildIndexFromPath({ cleanPath: 'model-code/model.yml', autoComponentIndexerOptions: 'Model' })).toEqual('ModelCode');
    expect(buildIndexFromPath({ cleanPath: 'model-code/models.yml', autoComponentIndexerOptions: 'Model' })).toEqual('ModelCodes');
  });

  it('it does fancy pluralization with trim', () => {
    expect(buildIndexFromPath({
      cleanPath: 'university/model.yml',
      autoComponentIndexerOptions: 'Model',
      enableFancyPluralization: true
    })).toEqual('University');
    expect(buildIndexFromPath({
      cleanPath: 'university/models.yml',
      autoComponentIndexerOptions: 'Model',
      enableFancyPluralization: true
    })).toEqual('Universities');
  });

  it('it does fancy pluralization with trim, adding an extra "s" when needed', () => {
    expect(buildIndexFromPath({
      cleanPath: 'sheep/model.yml',
      autoComponentIndexerOptions: 'Model',
      enableFancyPluralization: true
    })).toEqual('Sheep');
    expect(buildIndexFromPath({
      cleanPath: 'sheep/models.yml',
      autoComponentIndexerOptions: 'Model',
      enableFancyPluralization: true
    })).toEqual('Sheeps');
  });

  it('it does fancy pluralization with trim when name ends with "s"', () => {
    expect(buildIndexFromPath({
      cleanPath: 'address/model.yml',
      autoComponentIndexerOptions: 'Model',
      enableFancyPluralization: true
    })).toEqual('Address');
    expect(buildIndexFromPath({
      cleanPath: 'address/models.yml',
      autoComponentIndexerOptions: 'Model',
      enableFancyPluralization: true
    })).toEqual('Addresses');
  });

  it('it does fancy pluralization and only replaces last trim occurence ', () => {
    expect(buildIndexFromPath({ cleanPath: 'model-code/model.yml', autoComponentIndexerOptions: 'Model' })).toEqual('ModelCode');
    expect(buildIndexFromPath({ cleanPath: 'model-code/models.yml', autoComponentIndexerOptions: 'Model' })).toEqual('ModelCodes');
  });

  it('drops basename when in trimOpts', () => {
    expect(buildIndexFromPath({
      cleanPath: 'cool/weather/weather.yml',
      autoComponentIndexerOptions: { dropBaseName: true }
    })).toEqual('CoolWeather');
    expect(buildIndexFromPath({
      cleanPath: 'cool/weather/weather.yml',
      autoComponentIndexerOptions: { dropBaseName: true },
      enableFancyPluralization: true
    })).toEqual('CoolWeather');
  });
});
