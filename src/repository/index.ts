import { sheets_v4 } from 'googleapis';
import { createCache } from '../infra/cache';
import type { Cache } from '../types/cache';
import type { TableConfig } from '../types/config';
import type { Logger } from '../types/logger';
import type { Repository } from '../types/repository';
import { deleteByIds } from './delete';
import { findAll } from './find-all';
import { insertOrUpdate } from './insert';

export const createSheetsRepository = async <T extends Record<string, unknown>>(
  sheets: sheets_v4.Sheets,
  tableConfig: TableConfig,
  logger: Logger,
  cacheDurationMs = 5 * 60 * 1000
): Promise<Repository<T>> => {
  const cache: Cache = createCache(cacheDurationMs);

  return {
    insertOrUpdate: (entities: T[]) => insertOrUpdate<T>(entities, sheets, tableConfig, cache, logger),
    findAll: () => findAll<T>(sheets, tableConfig, cache, logger),
    deleteByIds: (ids: string[]) => deleteByIds(ids, sheets, tableConfig, cache, logger),
  };
};
