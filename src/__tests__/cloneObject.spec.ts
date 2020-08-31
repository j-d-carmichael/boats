import cloneobject from '../cloneObject';

describe('cloneObject', () => {
  it('compare cloned object to original', () => {
    const objectA = {
      dog: 'eats cat',
      cat: 'gets eaten',
      nests: {
        contain: ['birds', 'crazy people'],
      },
    };
    expect(cloneobject(objectA)).toEqual(objectA);
  });

  it('compare cloned proc env', () => {
    expect(cloneobject(process.env)).toEqual(process.env);
  });

  it('check original is not mutated', () => {
    process.env.BOATS = 'openapi tool';
    const clone = cloneobject(process.env);
    clone.BOATS = 'float on water';
    expect(process.env.BOATS).toBe('openapi tool');
  });
});
