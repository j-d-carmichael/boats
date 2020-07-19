export type JSON = { [key: string]: any };

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
  permissionConfig?: {
    routePrefix?: {
      get?: string;
      post?: string;
      put?: string;
      patch?: string;
      delete?: string;
    };
  };
}
