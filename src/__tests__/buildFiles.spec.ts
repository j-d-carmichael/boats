import fs from 'fs-extra';
import jsYaml from 'js-yaml';
import srcASYNC2 from '@/__tests__/buildFilesData/srcASYNC2.json';
import builtOA2_std from '@/__tests__/buildFilesData/builtOA2_std.json';
import builtOA2_inject from '@/__tests__/buildFilesData/builtOA2_inject.json';
import builtOA2_readonly from '@/__tests__/buildFilesData/builtOA2_readonly.json';
import builtOA2_no_version from '@/__tests__/buildFilesData/builtOA2_no_version.json';
import builtOA3 from '@/__tests__/buildFilesData/builtOA3.json';
import builtOA3_exclude from '@/__tests__/buildFilesData/builtOA3_exclude.json';

jest.setTimeout(60 * 1000); // in milliseconds

const dumper = (input: any) => {
  process.stderr.write('\n\n\n' + JSON.stringify(input) + '\n\n\n');
};

describe('Check to ensure the files are generated with the correct file names:', () => {
  it('built srcASYNC2_1.0.1.yml', async (done) => {
    const infile: any = jsYaml.safeLoad(fs.readFileSync('test-build/srcASYNC2/srcASYNC2_1.0.1.yml', 'utf8'));
    try {
      expect(infile).toEqual(srcASYNC2);
      done();
    } catch (e) {
      dumper(infile);
      done(e);
    }
  });

  it('built builtOA2_std_1.0.1.yml', async (done) => {
    const infile: any = jsYaml.safeLoad(fs.readFileSync('test-build/builtOA2_std/builtOA2_std_1.0.1.yml', 'utf8'));
    try {
      expect(infile).toEqual(builtOA2_std);
      done();
    } catch (e) {
      dumper(infile);
      done(e);
    }
  });

  it('built builtOA2_readonly_1.0.1.yml', async (done) => {
    const infile: any = jsYaml.safeLoad(
      fs.readFileSync('test-build/builtOA2_readonly/builtOA2_readonly_1.0.1.yml', 'utf8')
    );
    try {
      expect(infile).toEqual(builtOA2_readonly);
      done();
    } catch (e) {
      dumper(infile);
      done(e);
    }
  });

  it('built builtOA2_no_version.yml', async (done) => {
    const infile: any = jsYaml.safeLoad(
      fs.readFileSync('test-build/builtOA2_no_version/builtOA2_no_version.yml', 'utf8')
    );
    try {
      expect(infile).toEqual(builtOA2_no_version);
      done();
    } catch (e) {
      dumper(infile);
      done(e);
    }
  });

  it('built test-build/builtOA2_inject/api_1.0.1.yml', async (done) => {
    const infile: any = jsYaml.safeLoad(fs.readFileSync('test-build/builtOA2_inject/api_1.0.1.yml', 'utf8'));
    try {
      expect(infile).toEqual(builtOA2_inject);
      done();
    } catch (e) {
      dumper(infile);
      done(e);
    }
  });

  it('built builtOA3_1.0.1.yml', async (done) => {
    const infile: any = jsYaml.safeLoad(fs.readFileSync('test-build/builtOA3_std/builtOA3_1.0.1.yml', 'utf8'));
    try {
      expect(infile).toEqual(builtOA3);
      done();
    } catch (e) {
      dumper(infile);
      done(e);
    }
  });

  it('built builtOA3.yml', async (done) => {
    const infile: any = jsYaml.safeLoad(fs.readFileSync('test-build/builtOA3_exclude/builtOA3.yml', 'utf8'));
    try {
      expect(infile).toEqual(builtOA3_exclude);
      done();
    } catch (e) {
      dumper(infile);
      done(e);
    }
  });
});
