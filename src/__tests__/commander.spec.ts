import program from '../commander';

jest.mock('@/commander.helperFunctions', () => (path: string) => [path]);

describe('cli param parsing', () => {
  it('check the right stuff is returned', () => {
    const commanderReturn = program(['node', 'myscript', '--init', '-i', 'bill', '-o', 'ben', '-x']);
    expect(commanderReturn.init).toBe(true);
    expect(commanderReturn.input).toBe('bill');
    expect(commanderReturn.output).toBe('ben');
    expect(commanderReturn.exclude_version).toBe(true);
  });

  it('all the short options', () => {
    // shorts
    const commanderReturn = program([
      'node',
      'myscript',
      '-i',
      'inpath',
      '-o',
      'outpath',
      '-$',
      'variables',
      '-f',
      './egal',
      '-d',
      '-s',
      '/home/bobthebuilder',
      '-x',
      '-y'
    ]);
    expect(commanderReturn.input).toBe('inpath');
    expect(commanderReturn.output).toBe('outpath');
    expect(commanderReturn.variables).toEqual([{ variables: true }]);
    expect(commanderReturn.functions).toEqual(['./egal']);
    expect(commanderReturn.dereference).toBe(true);
    expect(commanderReturn.strip_value).toBe('/home/bobthebuilder');
    expect(commanderReturn.exclude_version).toBe(true);
    expect(commanderReturn.yes).toBe(true);
  });

  it('all the long options', () => {
    // longs
    const commanderReturn = program([
      'node',
      'myscript',
      '--init',
      '--input',
      'inpath',
      '--output',
      'outpath',
      '--variables',
      'variables',
      '--functions',
      './egal',
      '--dereference',
      '--strip_value',
      '/home/bobthebuilder',
      '--exclude_version',
      '--convert_to_njk',
      '/remote_directory_njk',
      '--convert_to_yml',
      '/remote_directory_yml',
      '--yes',
      '--skipValidation'
    ]);

    expect(commanderReturn.init).toBe(true);
    expect(commanderReturn.input).toBe('inpath');
    expect(commanderReturn.output).toBe('outpath');
    expect(commanderReturn.variables).toEqual([{ variables: true }]);
    expect(commanderReturn.functions).toEqual(['./egal']);
    expect(commanderReturn.dereference).toBe(true);
    expect(commanderReturn.strip_value).toBe('/home/bobthebuilder');
    expect(commanderReturn.exclude_version).toBe(true);
    expect(commanderReturn.convert_to_njk).toBe('/remote_directory_njk');
    expect(commanderReturn.convert_to_yml).toBe('/remote_directory_yml');
    expect(commanderReturn.yes).toBe(true);
    expect(commanderReturn.skipValidation).toBe(true);
  });
});
