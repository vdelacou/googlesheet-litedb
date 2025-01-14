import { sheets_v4 } from 'googleapis';
import type { TableConfig } from '../types/config';
import type { Repository } from '../types/repository';
import { findAll } from './find-all';
import { findBy } from './find-by';
import { insert } from './insert';

export type SheetConfig = {
  sheets: sheets_v4.Sheets;
  spreadsheetId: string;
  sheetName: string;
};
export const createSheetsRepository = async <T>(sheets: sheets_v4.Sheets, tableConfig: TableConfig): Promise<Repository<T>> => {
  return {
    insert: (entity: T) => insert<T>(entity, sheets, tableConfig),
    findAll: () => findAll<T>(sheets, tableConfig),
    findBy: (criteria: Partial<T>) => findBy<T>(criteria, sheets, tableConfig),

    //updateBy,
    // deleteBy,
  };
};
