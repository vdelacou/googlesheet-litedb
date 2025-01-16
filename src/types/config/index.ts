export type ColumnConfig = {
  attributeName: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'array' | 'object';
};

export type TableConfig = {
  spreadsheetId: string;
  sheetName: string;
  firstColumnIdConfig: { attributeName: string; type: 'string' };
  columns: ColumnConfig[];
};
