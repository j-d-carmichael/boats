import { JSON } from './BoatsRc';

export interface InjectorConfig {
  toAllOperations: {
    content: string | JSON;
    exclude?: string[];
    excludeChannels?: string[];
    excludePaths?: string[];
    includeMethods?: string[];
    includeChannels?: string[];
    includeOnlyPaths?: string[];
  };
}
