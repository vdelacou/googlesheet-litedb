import type { TableConfig } from '../../../types/config';

export const convertObjectValuesToString = <T>(object: T, tableConfig: TableConfig): Record<string, string | number> => {
  const result: Record<string, string | number> = {};
  const allColumValues = [tableConfig.firstColumnIdConfig, ...tableConfig.columns];

  allColumValues.forEach(({ attributeName, type }) => {
    const value = object[attributeName as keyof T];

    if (value === undefined || value === null) {
      result[String(attributeName)] = '';
      return;
    }

    switch (type) {
      case 'array':
      case 'object':
        result[String(attributeName)] = JSON.stringify(value);
        break;
      case 'boolean':
        result[String(attributeName)] = value.toString();
        break;
      case 'number':
        result[String(attributeName)] = value as number;
        break;
      case 'date':
        result[String(attributeName)] = value instanceof Date ? value.toISOString() : value.toString();
        break;
      default:
        result[String(attributeName)] = value.toString();
    }
  });

  return result;
};
