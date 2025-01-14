import type { sheets_v4 } from 'googleapis';
import { mapRowsToEntities } from '../../helpers/data/map-rows-to-entities';
import { buildRange } from '../../helpers/sheets/build-range';
import { getMinMaxColumnRange } from '../../helpers/sheets/get-column-range';
import type { TableConfig } from '../../types/config';

export const findAll = async <T>(sheets: sheets_v4.Sheets, tableConfig: TableConfig): Promise<T[]> => {
  const { sheetName, spreadsheetId, columns } = tableConfig;

  const [firstColumnIndex, lastColumnIndex] = getMinMaxColumnRange(columns);
  const range = buildRange(sheetName, firstColumnIndex, lastColumnIndex, 2);

  const rowsResponse = await sheets.spreadsheets.values.get({ spreadsheetId, range });

  const rows = rowsResponse.data.values ?? [];
  return mapRowsToEntities<T>(rows, tableConfig);
};
