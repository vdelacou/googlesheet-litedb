export type Cache = {
  setCache: (key: string, value: unknown) => void;
  getCache: (key: string) => unknown;
  clearCache: () => void;
};
