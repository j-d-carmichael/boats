import * as upath from 'upath';
import { Paths } from './interfaces/BoatsRc';

export class pathInjector {
  keyPatterns: string[];
  public injectMixin: (target: string) => [string, boolean];
  public injectRefs: (target: string, relativeRoot: string) => string;
  mixinExpressions: RegExp[];
  refExpressions: RegExp[];

  constructor(private paths: Paths, private pathModifier?: string) {
    this.paths = paths;
    this.pathModifier = pathModifier || '';

    if (paths) {
      // If we have paths, setup a working strategy and assign it, trim trailing slashes to avoid stripping them out later
      this.keyPatterns = Object.keys(paths);
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
        const value = upath.join(this.pathModifier, this.paths[this.keyPatterns[i]]);

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
          upath.relative(this.pathModifier, this.paths[this.keyPatterns[i]]));

        return target.replace(keyPattern, `$1${value}`).replace('//', '/');
      }
    }

    return target;
  }
}
