export type Logger = {
  info(message: string, object?: object): void;
  error(message: string, object?: object): void;
};
