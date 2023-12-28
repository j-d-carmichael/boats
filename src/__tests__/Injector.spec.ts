import Injector from '@/Injector';

describe('glob check', () => {
  it('simple match', () => {
    const currentPath = '/';
    const paths = ['/'];
    expect(Injector.globCheck(currentPath, paths, {}, 'GET')).toBe(true);
  });
  it('simple match', () => {
    const currentPath = '/path/one';
    const paths = ['/path/one'];
    expect(Injector.globCheck(currentPath, paths, {}, 'GET')).toBe(true);
  });
  it('simple match on a specific method', () => {
    const currentPath = '/path/one';
    const paths = [{ path: '/path/one', methods: ['GET', 'POST'] }];
    expect(Injector.globCheck(currentPath, paths, {}, 'GET')).toBe(true);
  });
  it('simple non-match on a specific method', () => {
    const currentPath = '/path/one';
    const paths = [{ path: '/path/one', methods: ['GET', 'POST'] }];
    expect(Injector.globCheck(currentPath, paths, {}, 'PUT')).toBe(false);
  });

  it('wildcard', () => {
    const currentPath = '/path/one/hello';
    const paths = ['/path/one/*'];
    expect(Injector.globCheck(currentPath, paths, {}, 'GET')).toBe(true);
  });
  it('simple match on a specific method', () => {
    const currentPath = '/path/one/hello';
    const paths = [{ path: '/path/one/*', methods: ['GET', 'POST'] }];
    expect(Injector.globCheck(currentPath, paths, {}, 'GET')).toBe(true);
  });
  it('simple non-match on a specific method', () => {
    const currentPath = '/path/one/hello';
    const paths = [{ path: '/path/one/*', methods: ['GET', 'POST'] }];
    expect(Injector.globCheck(currentPath, paths, {}, 'PUT')).toBe(false);
  });
});

