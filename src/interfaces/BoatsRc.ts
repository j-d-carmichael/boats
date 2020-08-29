import { StringStyle } from '@/enums/StringStyle';
import $RefParser from '@apidevtools/json-schema-ref-parser';

export type JSON = { [key: string]: any };

interface MethodAlias {
  get?: string;
  post?: string;
  put?: string;
  patch?: string;
  delete?: string;
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
  };
  jsonSchemaRefParserBundleOpts?: $RefParser.Options,
  permissionConfig?: {
    routePrefix?: MethodAlias // to be deprecated, use methodAlias instead
    methodAlias?: MethodAlias
    globalPrefix?: string | boolean
    usePackageJsonNameAsPrefix?: boolean // to be deprecated, use globalPrefix instead
    permissionStyle?: StringStyle
    permissionSegmentStyle?: StringStyle
  };
}
