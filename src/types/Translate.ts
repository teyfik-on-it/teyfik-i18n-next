export type Translate<
  T extends { key: string } = { key: string },
  U extends object = object,
> = (path: T | string, context?: U) => string;
