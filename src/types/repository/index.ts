export type Repository<T> = {
  insert(entity: T): Promise<void>;
  findAll(): Promise<T[]>;
  findBy(criteria: Partial<T>): Promise<T[]>;
  // updateBy(idCriteria: Partial<T>, entity: Partial<T>): Promise<T>;
  // deleteBy(idCriteria: Partial<T>): Promise<boolean>;
};
