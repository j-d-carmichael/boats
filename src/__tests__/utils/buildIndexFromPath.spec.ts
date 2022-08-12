import buildIndexFromPath from '@/utils/buildIndexFromPath';

describe('glob check', () => {
  it('it does dumb pluralization without trim', () => {
    expect(buildIndexFromPath('university/model.yml')).toEqual('UniversityModel');
    expect(buildIndexFromPath('university/models.yml')).toEqual('UniversityModels');
  });

  it('it does dumb pluralization with trim', () => {
    expect(buildIndexFromPath('university/model.yml', 'Model')).toEqual('University');
    expect(buildIndexFromPath('university/models.yml', 'Model')).toEqual('Universitys');
  });

  it('it does dumb pluralization and only replaces last trim occurence ', () => {
    expect(buildIndexFromPath('model-code/model.yml', 'Model')).toEqual('ModelCode');
    expect(buildIndexFromPath('model-code/models.yml', 'Model')).toEqual('ModelCodes');
  });

  it('it does fancy pluralization with trim', () => {
    expect(buildIndexFromPath('university/model.yml', 'Model', true)).toEqual('University');
    expect(buildIndexFromPath('university/models.yml', 'Model', true)).toEqual('Universities');
  });

  it('it does fancy pluralization with trim, adding an extra "s" when needed', () => {
    expect(buildIndexFromPath('sheep/model.yml', 'Model', true)).toEqual('Sheep');
    expect(buildIndexFromPath('sheep/models.yml', 'Model', true)).toEqual('Sheeps');
  });

  it('it does fancy pluralization with trim when name ends with "s"', () => {
    expect(buildIndexFromPath('address/model.yml', 'Model', true)).toEqual('Address');
    expect(buildIndexFromPath('address/models.yml', 'Model', true)).toEqual('Addresses');
  });

  it('it does fancy pluralization and only replaces last trim occurence ', () => {
    expect(buildIndexFromPath('model-code/model.yml', 'Model')).toEqual('ModelCode');
    expect(buildIndexFromPath('model-code/models.yml', 'Model')).toEqual('ModelCodes');
  });

  it('drops basename when in trimOpts', () => {
    expect(buildIndexFromPath('cool/weather/weather.yml', { dropBaseName: true })).toEqual('CoolWeather');
    expect(buildIndexFromPath('cool/weather/weather.yml', { dropBaseName: true }, true)).toEqual('CoolWeather');
  });
});
