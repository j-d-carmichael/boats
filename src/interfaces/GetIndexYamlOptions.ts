export type AutoComponentIndexerOptions =
  | {
  dropBaseName: boolean;
  dontUcFirst?: boolean;
}
  | string;

export interface AutoChannelIndexerOptions {
  channelSeparators: {
    match: string,
    separator: string
  }[];
}

export interface GetIndexYamlOptions {
  autoComponentIndexerOptions?: AutoComponentIndexerOptions;
  autoChannelIndexerOptions?: AutoChannelIndexerOptions;
  channels?: any;
  components?: any;
  dontUcFirst?: boolean;
  paths?: any;
}
