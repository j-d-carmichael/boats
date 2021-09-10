export type JsonSchema = {
  [key: string]: unknown;
  components?: {
    schemas?: Record<string, unknown>
  }
};
