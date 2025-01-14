import type { sheets_v4 } from 'googleapis';
import { mapRowsToEntities } from '../../helpers/data/map-rows-to-entities';
import { convertObjectValuesToString } from '../../helpers/data/object-to-string-converter';
import { separateConsecutiveNumbers } from '../../helpers/data/separate-consecutive-number';
import { fetchColumnMatches } from '../../helpers/sheets/fetch-column-matches';
import { fetchRowsForIndexes } from '../../helpers/sheets/fetch-rows-for-indexes';
import { getMinMaxColumnRange } from '../../helpers/sheets/get-column-range';
import { getCommonRowIndexes } from '../../helpers/sheets/get-common-row-indexes';
import { getSearchColumns } from '../../helpers/sheets/get-search-columns';
import type { TableConfig } from '../../types/config';

export const findBy = async <T>(criteria: Partial<T>, sheets: sheets_v4.Sheets, tableConfig: TableConfig): Promise<T[]> => {
  if (Object.keys(criteria).length === 0) return [];

  const { sheetName, spreadsheetId, columns } = tableConfig;
  const stringifiedCriteria = convertObjectValuesToString(criteria, tableConfig);

  const searchColumns = getSearchColumns(criteria, columns);

  const columnMatches = await fetchColumnMatches(searchColumns, stringifiedCriteria, sheets, spreadsheetId, sheetName);
  const commonRowIndexes = getCommonRowIndexes(columnMatches);
  if (commonRowIndexes.length === 0) return [];

  const separatedIndexes = separateConsecutiveNumbers(commonRowIndexes);
  const [firstColumnIndex, lastColumnIndex] = getMinMaxColumnRange(columns);
  const rows = await fetchRowsForIndexes(sheets, spreadsheetId, sheetName, firstColumnIndex, lastColumnIndex, separatedIndexes);

  return mapRowsToEntities<T>(rows, tableConfig);
};
