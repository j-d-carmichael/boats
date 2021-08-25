import $RefParser from '@apidevtools/json-schema-ref-parser';
import { StringStyle } from '@/enums/StringStyle';
import { MethodAliasPosition } from '@/enums/MethodAliasPosition';

export type JSON = { [key: string]: any };

export interface MethodAlias {
  get?: string;
  post?: string;
  put?: string;
  patch?: string;
  delete?: string;
}

export interface Paths {
    [key: string]: string;
  }

export interface BoatsRC {
  nunjucksOptions?: {
    tags?: {
      blockStart?: string;
      blockEnd?: string;
      variableStart?: string;
      variableEnd?: string;
      commentStart?: string;
      commentEnd?: string;
    };
    [key: string]: any;
  };
  jsonSchemaRefParserBundleOpts?: $RefParser.Options;
  permissionConfig?: {
    routePrefix?: MethodAlias; // to be deprecated, use methodAlias instead
    methodAlias?: MethodAlias;
    methodAliasPosition?: MethodAliasPosition;
    globalPrefix?: string | boolean;
    usePackageJsonNameAsPrefix?: boolean; // to be deprecated, use globalPrefix instead
    permissionStyle?: StringStyle;
    permissionSegmentStyle?: StringStyle;
  };
  picomatchOptions?: any;
  fancyPluralization?: boolean;
  paths?: Paths;
}
