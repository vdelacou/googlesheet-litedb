import type { sheets_v4 } from 'googleapis';
import type { TableConfig } from '../../../types/config';
import { buildRange } from '../build-range';

export const fetchColumnMatches = async (
  searchColumns: TableConfig['columns'],
  stringifiedCriteria: Record<string, string | number>,
  sheets: sheets_v4.Sheets,
  spreadsheetId: string,
  sheetName: string
): Promise<number[][]> => {
  return Promise.all(
    searchColumns.map(async (column) => {
      const range = buildRange(sheetName, column.columnIndex, column.columnIndex);
      const rowsResponse = await sheets.spreadsheets.values.get({ spreadsheetId, range });
      const columnValues = rowsResponse.data.values?.map((row) => row[0] as string) || [];

      return columnValues.flatMap((value, index) => {
        const criteriaValue = stringifiedCriteria[column.attributeName];
        if (column.type === 'number') {
          return Number(value) === criteriaValue ? index : [];
        }
        return value === criteriaValue ? index : [];
      });
    })
  );
};
