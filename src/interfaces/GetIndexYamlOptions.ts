export type Remove = {
  dropBaseName: boolean
} | string;

export interface GetIndexYamlOptions {
  channels?: any,
  components?: any,
  paths?: any,
  remove?: Remove
}