import { sheets_v4 } from 'googleapis';
import { createCache } from '../infra/cache';
import type { Cache } from '../types/cache';
import type { TableConfig } from '../types/config';
import type { Repository } from '../types/repository';
import { deleteByIds } from './delete';
import { findAll } from './find-all';
import { insertOrUpdate } from './insert';

export const createSheetsRepository = <T extends Record<string, unknown>>(sheets: sheets_v4.Sheets, tableConfig: TableConfig, cacheDurationMs = 5 * 60 * 1000): Repository<T> => {
  const cache: Cache = createCache(cacheDurationMs);

  return {
    insertOrUpdate: (entities: T[]) => insertOrUpdate<T>(entities, sheets, tableConfig, cache),
    findAll: () => findAll<T>(sheets, tableConfig, cache),
    deleteByIds: (ids: string[]) => deleteByIds(ids, sheets, tableConfig, cache),
  };
};
