import type { sheets_v4 } from 'googleapis';
import { convertObjectValuesToString } from '../../helpers/data/convert-object-values-to-string';
import { buildRange } from '../../helpers/sheets/build-range';
import type { Cache } from '../../types/cache';
import type { TableConfig } from '../../types/config';
import type { Logger } from '../../types/logger';
import { getAllIds } from '../get-all-ids';

export const insertOrUpdate = async <T extends Record<string, unknown>>(
  entities: T[],
  sheets: sheets_v4.Sheets,
  tableConfig: TableConfig,
  cache: Cache,
  logger: Logger
): Promise<void> => {
  const { spreadsheetId, sheetName, columns, firstColumnIdConfig } = tableConfig;

  // Get existing IDs and their row positions
  const idsWithRows = await getAllIds(sheets, tableConfig, cache, logger);

  // Separate entities into updates and inserts
  const entitiesToUpdate: { entity: T; rowIndex: number }[] = [];
  const entitiesToInsert: T[] = [];

  entities.forEach((entity) => {
    const entityId = String(entity[firstColumnIdConfig.attributeName]);
    const existingRow = idsWithRows.find((row) => row.id === entityId);

    if (existingRow) {
      entitiesToUpdate.push({ entity, rowIndex: existingRow.rowIndex });
    } else {
      entitiesToInsert.push(entity);
    }
  });

  logger.info('Entities to insert', { count: entitiesToInsert.length });
  logger.info('Entities to update', { count: entitiesToUpdate.length });

  // Handle updates if any
  if (entitiesToUpdate.length > 0) {
    const updateRequests = entitiesToUpdate.map(({ entity, rowIndex }) => {
      const stringValues = convertObjectValuesToString(entity, tableConfig);
      const rowValues = [stringValues[firstColumnIdConfig.attributeName], ...columns.map((col) => stringValues[col.attributeName])];

      return {
        range: buildRange(sheetName, 0, columns.length, rowIndex, rowIndex),
        values: [rowValues],
      };
    });

    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId,
      requestBody: {
        valueInputOption: 'RAW',
        data: updateRequests,
      },
    });
  }

  // Handle inserts if any
  if (entitiesToInsert.length > 0) {
    const rowsToInsert = entitiesToInsert.map((entity) => {
      const stringValues = convertObjectValuesToString(entity, tableConfig);
      return [stringValues[firstColumnIdConfig.attributeName], ...columns.map((col) => stringValues[col.attributeName])];
    });

    const rangeToInsert = buildRange(sheetName, 0, columns.length);
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: rangeToInsert,
      valueInputOption: 'RAW',
      requestBody: { values: rowsToInsert },
    });
  }

  // Clear cache since we modified the sheet
  cache.clearCache();
};
