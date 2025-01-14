export type ColumnConfig = {
  columnIndex: number;
  attributeName: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'array' | 'object';
};

export type TableConfig = {
  spreadsheetId: string;
  sheetName: string;
  columns: ColumnConfig[];
};
