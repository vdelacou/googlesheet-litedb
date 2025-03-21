# googlesheet-litedb

A lightweight TypeScript library that turns Google Sheets into a simple database with CRUD operations. Perfect for prototypes, small applications, or when you need a simple, visual data store that non-technical users can also access.

## Features

- 🔄 Simple CRUD operations (Insert or Update by Batch, Find All, Delete with id by Batch)
- 📊 Uses Google Sheets as a database backend
- 🚀 Type-safe with TypeScript
- 🎯 Automatic type conversion for common data types
- ⚡ Built-in caching for better performance
- 📝 Simple API for data operations

## Installation

```bash
npm install googlesheet-litedb googleapis
# or
yarn add googlesheet-litedb googleapis
# or
bun add googlesheet-litedb googleapis
```

## Prerequisites for this example

1. Set up a Google Cloud Project
2. Enable the Google Sheets API
3. Create service account credentials
4. Share your Google Sheet with the service account email

```bash
gcloud auth login

gcloud config set project YOUR_PROJECT_ID

gcloud services enable sheets.googleapis.com

gcloud services enable drive.googleapis.com

gcloud auth application-default login --scopes=https://www.googleapis.com/auth/cloud-platform,https://www.googleapis.com/auth/drive,https://www.googleapis.com/auth/spreadsheets
```

## Usage

### Basic Example

```typescript
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
```

## Supported Data Types

- `string`
- `number`
- `date`
- `boolean`
- `array`
- `object`

## Configuration

### TableConfig Interface

```typescript
type TableConfig = {
  spreadsheetId: string;
  sheetName: string;
  firstColumnIdConfig: {
    attributeName: string;
    type: 'string';
  };
  columns: {
    attributeName: string;
    type: 'string' | 'number' | 'date' | 'boolean' | 'array' | 'object';
  }[];
};
```

### Cache Configuration

The library includes built-in caching to improve performance. By default, cache expires after 5 minutes. You can customize this when creating the repository.

## Best Practices

1. Always use the first column as the ID column
2. Keep your sheet structure simple and flat
3. Use appropriate data types for your columns

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.