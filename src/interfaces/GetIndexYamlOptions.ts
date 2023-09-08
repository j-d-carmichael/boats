export type AutoComponentIndexerOptions =
  | {
      dropBaseName: boolean;
      dontUcFirst?: boolean;
    }
  | string;

export interface GetIndexYamlOptions {
  autoComponentIndexerOptions?: AutoComponentIndexerOptions;
  channels?: any;
  components?: any;
  dontUcFirst?: boolean;
  paths?: any;
}
