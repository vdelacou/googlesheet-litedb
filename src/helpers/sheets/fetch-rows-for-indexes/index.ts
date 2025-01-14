import type { sheets_v4 } from 'googleapis';
import { buildRange } from '../build-range';

export const fetchRowsForIndexes = async (
  sheets: sheets_v4.Sheets,
  spreadsheetId: string,
  sheetName: string,
  firstColumnIndex: number,
  lastColumnIndex: number,
  separatedIndexes: number[][]
): Promise<string[][]> => {
  const rowFetchPromises = separatedIndexes.map(async (indexes) => {
    const start = indexes[0];
    const end = indexes[indexes.length - 1];
    const range = buildRange(sheetName, firstColumnIndex, lastColumnIndex, start + 1, end + 1);
    const rowsResponse = await sheets.spreadsheets.values.get({ spreadsheetId, range });
    return rowsResponse.data.values || [];
  });

  return (await Promise.all(rowFetchPromises)).flat();
};
