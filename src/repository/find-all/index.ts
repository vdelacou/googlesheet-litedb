import type { sheets_v4 } from 'googleapis';
import { restoreObjectFromString } from '../../helpers/data/restore-object-from-string';
import { buildRange } from '../../helpers/sheets/build-range';
import type { Cache } from '../../types/cache';
import type { TableConfig } from '../../types/config';
import type { Logger } from '../../types/logger';

export const findAll = async <T>(sheets: sheets_v4.Sheets, tableConfig: TableConfig, cache: Cache, logger: Logger): Promise<T[]> => {
  const { sheetName, spreadsheetId, columns, firstColumnIdConfig } = tableConfig;

  const cacheKey = `findAll-${sheetName}`;
  const cachedData = cache.getCache(cacheKey);
  if (cachedData) {
    return cachedData as T[];
  }

  // Get all values from the sheet
  const range = buildRange(sheetName, 0, columns.length);
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  const rows = response.data.values || [];
  if (rows.length === 0) {
    return [];
  }

  // Convert rows to objects
  const entities = rows.map((row) => {
    const stringObject: Record<string, string> = {
      [firstColumnIdConfig.attributeName]: String(row[0]),
    };

    // Map remaining columns
    columns.forEach((column, index) => {
      stringObject[column.attributeName] = String(row[index + 1] ?? '');
    });

    return restoreObjectFromString<T>(stringObject, tableConfig);
  });

  logger.info('Find All', { count: entities.length });

  cache.setCache(cacheKey, entities);
  return entities;
};
