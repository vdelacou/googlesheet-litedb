import type { TableConfig } from '../../../types/config';

export const getMinMaxColumnRange = (columns: TableConfig['columns']): [number, number] => {
  const columnIndexes = columns.map((col) => col.columnIndex);
  return [Math.min(...columnIndexes), Math.max(...columnIndexes)];
};
