import { BaseExternalAccountClient, GoogleAuth } from 'google-auth-library';
import { google } from 'googleapis';
import { createLogger, format, transports } from 'winston';
import { createSheetsRepository } from '../src/repository';
import type { TableConfig } from '../src/types/config';
import type { Logger } from '../src/types/logger';

const logger = createLogger({
  level: 'info',
  format: format.json(),
  transports: [new transports.Console()],
});

const myLogger: Logger = {
  info: (message, data) => logger.info(message, data),
  error: (message, data) => logger.error(message, data),
};

export type User = {
  id: string;
  name: string;
  email: string;
  numberOfChildren: number;
  createdAt: Date;
};

const example = async (): Promise<void> => {
  const defaultScopes = ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive.file'];
  const auth = new GoogleAuth({ scopes: defaultScopes });
  const authClient = (await auth.getClient()) as BaseExternalAccountClient;
  const sheets = google.sheets({ version: 'v4', auth: authClient });

  const userTableConfig: TableConfig = {
    spreadsheetId: '1Bgv4A0RAkAyPeveFAXHz3WBZ3dEPUtitKSU48bue_0k',
    sheetName: 'Users',
    firstColumnIdConfig: { attributeName: 'id', type: 'string' },
    columns: [
      { attributeName: 'name', type: 'string' },
      { attributeName: 'email', type: 'string' },
      { attributeName: 'numberOfChildren', type: 'number' },
      { attributeName: 'createdAt', type: 'date' },
    ],
  };
  // Initialize repository and service
  const userRepository = await createSheetsRepository<User>(sheets, userTableConfig, myLogger);

  // Create users
  const id = crypto.randomUUID();
  await userRepository.insertOrUpdate([
    {
      id,
      name: 'John Doe',
      email: 'john@example.com',
      numberOfChildren: 2,
      createdAt: new Date(),
    },
  ]);
  logger.info('New users created');

  // Update users
  await userRepository.insertOrUpdate([
    {
      id,
      name: 'Jane Doe',
      email: 'jane@example.com',
      numberOfChildren: 3,
      createdAt: new Date(),
    },
  ]);
  logger.info('Users updated');

  // Find all users
  const users = await userRepository.findAll();
  logger.info('All Users', { length: users });

  // Delete user
  await userRepository.deleteByIds([id]);
  logger.info('User deleted');
};

example();
