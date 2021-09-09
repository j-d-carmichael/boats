import * as upath from 'upath';
import { Paths } from './interfaces/BoatsRc';
import fs from 'fs-extra';

export class pathInjector {
  keyPatterns: string[];
  public injectMixin: (target: string) => [string, boolean];
  public injectRefs: (target: string, relativeRoot: string) => string;
  mixinExpressions: RegExp[];
  refExpressions: RegExp[];

  private enrichForSpecialCases(paths: Paths, sourceRoot?: string): Paths {
    if (!sourceRoot) { return paths }

    // When the root of the source is a valid path under one of the absolute paths
    // Then we need to add a special case to ensure it is converted into a relative path
    const validPaths = Object.keys(paths)
                           .filter((prefix) =>
                              fs.pathExistsSync(upath.join(paths[prefix], sourceRoot)));

    if (validPaths.length > 0) {
      validPaths.forEach((prefix) => {
        paths[upath.join(prefix, sourceRoot)] = upath.join(paths[prefix], sourceRoot);
      });
    }

    return paths;
  }

  constructor(private paths: Paths, private sourceFolderInWorkspace?: string) {
    this.paths = this.enrichForSpecialCases(paths, sourceFolderInWorkspace);
    this.sourceFolderInWorkspace = sourceFolderInWorkspace || '';

    if (paths) {
      // If we have paths, setup a working strategy and assign it

      // Sort the patterns so the most specific ones are first (crudely using longest as most specific)
      this.keyPatterns = Object.keys(paths).sort((a, b) => b.length - a.length);

      // trim trailing slashes to avoid stripping them out later
      this.mixinExpressions = this.keyPatterns.map((str) => str.replace(/\/$/, '')).map((str) => new RegExp(str, 'g'));
      this.refExpressions = this.keyPatterns
        .map((str) => str.replace(/\/$/, ''))
        .map((str) => new RegExp(`(\\$ref[ '"]*:[ '"]*)(${str})`, 'gs'));

      this.injectMixin = this.doInject;
      this.injectRefs = this.doInjectRefs;
    } else {
      // Inject the null strategy
      this.injectMixin = this.skip;
      this.injectRefs = (str, _) => str;
    }
  }

  private skip(target: string): [string, boolean] {
    return [target, false];
  }

  private doInject(target: string): [string, boolean] {
    for (let i = 0; i < this.mixinExpressions.length; i++) {
      const keyPattern = this.mixinExpressions[i];

      if (keyPattern.test(target)) {
        const value = this.paths[this.keyPatterns[i]];

        return [upath.normalize(target.replace(keyPattern, value)), true];
      }
    }

    return [target, false];
  }

  private doInjectRefs(target: string, relativeRoot: string): string {
    for (let i = 0; i < this.refExpressions.length; i++) {
      const keyPattern = this.refExpressions[i];

      if (keyPattern.test(target)) {
        // First remove the relative path from the .boatsrc to the index file,
        // as the templating has already happened
        // files are no longer where they were, and have all moved to locations relative to the index file
        const value = upath.join(relativeRoot,
          upath.relative(this.sourceFolderInWorkspace, this.paths[this.keyPatterns[i]]));

        return target.replace(keyPattern, `$1${value.replace('//', '/')}`);
      }
    }

    return target;
  }
}
