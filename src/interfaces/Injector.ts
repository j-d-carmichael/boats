import { JSON } from './generic';

export interface InjectorConfig {
  toAllOperations: {
    content: string | JSON;
    exclude?: string[];
    excludePaths?: string[];
    includeMethods?: string[];
  };
}
