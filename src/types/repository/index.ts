export type Repository<T> = {
  insertOrUpdate(entitiies: T[]): Promise<void>;
  findAll(): Promise<T[]>;
  deleteByIds(ids: string[]): Promise<void>;
};
