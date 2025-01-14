import type { TableConfig } from '../../../types/config';
import { restoreObjectFromString } from '../object-to-string-converter';

export const mapRowsToEntities = <T>(rows: string[][], tableConfig: TableConfig): T[] => {
  const { columns } = tableConfig;

  return rows.map((row) => {
    const stringObject: Record<string, string> = {};

    columns.forEach((column) => {
      const { columnIndex, attributeName } = column;
      stringObject[String(attributeName)] = row.at(columnIndex) ?? '';
    });

    return restoreObjectFromString<T>(stringObject, tableConfig);
  });
};
