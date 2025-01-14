import type { sheets_v4 } from 'googleapis';

import { convertObjectValuesToString } from '../../helpers/data/object-to-string-converter';
import { buildRange } from '../../helpers/sheets/build-range';
import { getMinMaxColumnRange } from '../../helpers/sheets/get-column-range';
import type { TableConfig } from '../../types/config';

export const insert = async <T>(entity: T, sheets: sheets_v4.Sheets, tableConfig: TableConfig): Promise<void> => {
  const { spreadsheetId, sheetName, columns } = tableConfig;
  const stringifiedEntity = convertObjectValuesToString(entity, tableConfig);

  const [firstColumnIndex, lastColumnIndex] = getMinMaxColumnRange(columns);

  const row = Array(lastColumnIndex - firstColumnIndex + 1)
    .fill('')
    .map((_, index) => {
      const column = columns.find((col) => col.columnIndex === index + firstColumnIndex);
      return column ? (stringifiedEntity[String(column.attributeName)] ?? '') : '';
    });

  const range = buildRange(sheetName, firstColumnIndex, lastColumnIndex);

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: 'RAW',
    requestBody: { values: [row] },
  });
};
