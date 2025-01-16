import type { TableConfig } from '../../../types/config';

export const restoreObjectFromString = <T>(stringObject: Record<string, string>, tableConfig: TableConfig): T => {
  const result: Record<string, unknown> = {};
  const allColumValues = [tableConfig.firstColumnIdConfig, ...tableConfig.columns];

  Object.entries(stringObject).forEach(([key, value]) => {
    if (!value) {
      result[String(key)] = null;
      return;
    }

    const column = allColumValues.find((c) => c.attributeName === key);
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
