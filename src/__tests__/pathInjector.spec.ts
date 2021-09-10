import { PathInjector } from "@/pathInjector";

describe("null pathInjector", () => {
  let injector: PathInjector = new PathInjector(null);

  it("injectRefs shouldn't do anything", () => {
    expect(injector.injectRefs('$ref: ../test', '../')).toStrictEqual('$ref: ../test');
  })

  it("injectMixin shouldn't do anything", () => {
    expect(injector.injectMixin('$ref: ../test')).toStrictEqual(['$ref: ../test', false]);
  });
});

describe("configured pathInjector", () => {
  let injector: PathInjector = new PathInjector({
    "@/test": "./path/for/testing",
    "@/": "./other"
  });

  it('injectRefs should re-write path', () => {
    expect(injector.injectRefs('$ref: @/test', './')).toStrictEqual('$ref: path/for/testing');
  });

  it('injectRefs shouldn\'t re-write paths that don\'t match', () => {
    expect(injector.injectRefs('$ref: ../test', './')).toStrictEqual('$ref: ../test');
  });

  it('injectRefs should insert relative root folder if necessary', () => {
    expect(injector.injectRefs('$ref: @/test', 'srcRoot')).toStrictEqual('$ref: srcRoot/path/for/testing');
  });

  it('injectMixin should re-write path', () => {
    expect(injector.injectMixin('$ref: @/test')).toStrictEqual(['$ref: ./path/for/testing', true]);
  });

  it("injectRefs shouldn't re-write paths that don't match", () => {
    expect(injector.injectMixin('$ref: ../test')).toStrictEqual(['$ref: ../test', false]);
  });
});

describe("configured pathInjector with src folder in a different path", () => {
  let injector: PathInjector = new PathInjector(
    {
      '@/test': './path/for/testing',
      '@/': './',
    },
    'src/__tests__'
  );

  it('injectRefs should re-write path', () => {
    expect(injector.injectRefs('$ref: @/test', './')).toStrictEqual('$ref: ../../path/for/testing');
  });

  it('injectRefs shouldn\'t re-write paths that don\'t match', () => {
    expect(injector.injectRefs('$ref: ../test', './')).toStrictEqual('$ref: ../test');
  });

  it('injectRefs should insert relative root folder if necessary', () => {
    expect(injector.injectRefs('$ref: @/test', 'src')).toStrictEqual('$ref: ../path/for/testing');
  });

  it('injectRefs should handle resolving paths inside the source folder', () => {
    expect(injector.injectRefs('$ref: @/src/__tests__/test/path', '')).toStrictEqual(
      '$ref: ./test/path'
    );
  });

  it('Rendering from otherRoot to inside our sourceRoot', () => {
    expect(injector.injectRefs('$ref: @/src/__tests__/test/path', 'otherRoot')).toStrictEqual('$ref: otherRoot/test/path');
  });

  it('injectMixin should re-write path, but ignore the root to workspace', () => {
    expect(injector.injectMixin('$ref: @/test')).toStrictEqual(['$ref: ./path/for/testing', true]);
  });

  it("injectRefs shouldn't re-write paths that don't match", () => {
    expect(injector.injectMixin('$ref: ../test')).toStrictEqual(['$ref: ../test', false]);
  });
});
