import { JSON } from './generic';

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
