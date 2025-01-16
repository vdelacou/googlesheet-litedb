import type { sheets_v4 } from 'googleapis';
import { buildRange } from '../../helpers/sheets/build-range';
import type { Cache } from '../../types/cache';
import type { TableConfig } from '../../types/config';
import type { Logger } from '../../types/logger';

export type IdWithRow = {
  id: string;
  rowIndex: number;
};

export const getAllIds = async (sheets: sheets_v4.Sheets, tableConfig: TableConfig, cache: Cache, logger: Logger): Promise<IdWithRow[]> => {
  const { sheetName, spreadsheetId } = tableConfig;

  const cacheKey = `getAllIds-${sheetName}`;
  const cachedData = cache.getCache(cacheKey);
  if (cachedData) {
    return cachedData as IdWithRow[];
  }

  const rowsResponse = await sheets.spreadsheets.values.get({ spreadsheetId, range: buildRange(sheetName, 0, 0) });
  const rows: string[][] = rowsResponse.data.values || [];

  // Map the rows to include both id and rowIndex (adding 1 because sheet rows are 1-based)
  const idsWithRows = rows.map((row, index) => ({
    id: row[0],
    rowIndex: index + 1,
  }));

  logger.info('Get All IDs from sheet', { count: idsWithRows.length });

  cache.setCache(cacheKey, idsWithRows);
  return idsWithRows;
};
