import type { TableConfig } from '../../../types/config';

export const convertObjectValuesToString = <T>(object: T, tableConfig: TableConfig): Record<string, string | number> => {
  const result: Record<string, string | number> = {};

  tableConfig.columns.forEach(({ attributeName, type }) => {
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

export const restoreObjectFromString = <T>(stringObject: Record<string, string>, tableConfig: TableConfig): T => {
  const result: Record<string, unknown> = {};

  Object.entries(stringObject).forEach(([key, value]) => {
    if (!value) {
      result[String(key)] = null;
      return;
    }

    const column = tableConfig.columns.find((c) => c.attributeName === key);
    const type = column?.type ?? 'string';

    switch (type) {
      case 'array':
      case 'object':
        try {
          result[String(key)] = JSON.parse(value);
        } catch {
          result[String(key)] = value;
        }
        break;
      case 'boolean':
        result[String(key)] = value.toLowerCase() === 'true';
        break;
      case 'date':
        result[String(key)] = new Date(value);
        break;
      case 'number':
        result[String(key)] = Number(value);
        break;
      default:
        result[String(key)] = value;
    }
  });

  return result as T;
};
