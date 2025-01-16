import type { sheets_v4 } from 'googleapis';
import { buildRange } from '../../helpers/sheets/build-range';
import type { Cache } from '../../types/cache';
import type { TableConfig } from '../../types/config';
import type { Logger } from '../../types/logger';
import { getAllIds } from '../get-all-ids';

export const deleteByIds = async (ids: string[], sheets: sheets_v4.Sheets, tableConfig: TableConfig, cache: Cache, logger: Logger): Promise<void> => {
  const { spreadsheetId, sheetName, columns } = tableConfig;

  // Get current IDs and their positions
  const idsWithRows = await getAllIds(sheets, tableConfig, cache, logger);

  // Find rows to delete and sort them in descending order
  // (delete from bottom to top to avoid shifting issues)
  const rowsToDelete = ids
    .map((id) => idsWithRows.find((row) => row.id === id))
    .filter((row): row is { id: string; rowIndex: number } => row !== undefined)
    .sort((a, b) => b.rowIndex - a.rowIndex);

  if (rowsToDelete.length === 0) {
    return;
  }

  // Create batch clear requests
  const requests = rowsToDelete.map(({ rowIndex }) => ({
    range: buildRange(sheetName, 0, columns.length, rowIndex, rowIndex),
  }));

  // Clear all rows in a single batch request
  await sheets.spreadsheets.values.batchClear({
    spreadsheetId,
    requestBody: {
      ranges: requests.map((req) => req.range),
    },
  });

  logger.info('Delete By IDs', { count: ids.length });

  // Clear cache since we modified the sheet
  cache.clearCache();
};
