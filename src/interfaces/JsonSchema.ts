export interface JsonSchema {
  [key: string]: unknown;
  definitions?: Record<string, unknown>,
  components?: {
    schemas?: Record<string, unknown>
  }
}
