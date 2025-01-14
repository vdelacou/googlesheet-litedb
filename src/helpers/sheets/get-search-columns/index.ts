import type { TableConfig } from '../../../types/config';

export const getSearchColumns = <T>(criteria: Partial<T>, columns: TableConfig['columns']): TableConfig['columns'] => {
  const searchFields = Object.keys(criteria);
  return columns.filter((column) => searchFields.includes(column.attributeName));
};
