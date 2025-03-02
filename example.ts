import { GoogleAuth } from 'google-auth-library';
import { google } from 'googleapis';
import type { TableConfig } from './src';
import { createSheetsRepository } from './src';

/********************
 * Configure library
 ********************/

// Define your data structure
type User = {
  id: string;
  name: string;
  email: string;
  numberOfChildren: number;
  createdAt: Date;
};

// Configure your table
const userTableConfig: TableConfig = {
  spreadsheetId: '1jEhnMVntZZcyWsfyZ16_n_aotlClFLyqwHWJVkgoVpA',
  sheetName: 'Users',
  firstColumnIdConfig: { attributeName: 'id', type: 'string' }, // should be the first column of your table
  columns: [
    // other columns of your table in the order in the sheet
    { attributeName: 'name', type: 'string' },
    { attributeName: 'email', type: 'string' },
    { attributeName: 'numberOfChildren', type: 'number' },
    { attributeName: 'createdAt', type: 'date' },
  ],
};

// Initialize Google Sheets client
const auth = new GoogleAuth({ scopes: ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive.file'] });
const sheetsClient = google.sheets({ version: 'v4', auth });

/********************
 * Use the library
 ********************/
// Create repository
const userRepository = createSheetsRepository<User>(
  sheetsClient,
  userTableConfig,
  5 * 60 * 1000 // cache duration in milliseconds, default value is 5 minutes (argument is optional)
);

// Use the repository
// Insert or update users
await userRepository.insertOrUpdate([
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    numberOfChildren: 2,
    createdAt: new Date(),
  },
]);
// Find all users
await userRepository.findAll();

// Delete user
await userRepository.deleteByIds(['1']);
