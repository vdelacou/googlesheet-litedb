type Fail<ERROR> = {
  data?: never;
  error: ERROR;
};

type Success<RESPONSE> = {
  error?: never;
  data: RESPONSE;
};

export type Result<RESPONSE, ERROR> = NonNullable<Success<RESPONSE> | Fail<ERROR>>;

export const createFail = <ERROR>(error: ERROR): Fail<ERROR> => ({ error });

export const createSuccess = <RESPONSE>(data: RESPONSE): Success<RESPONSE> => ({ data });

export const createSuccessVoid = (): Success<void> => ({ data: undefined });
