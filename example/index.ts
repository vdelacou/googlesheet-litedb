import { BaseExternalAccountClient, GoogleAuth } from 'google-auth-library';
import { google } from 'googleapis';
import { createLogger, format, transports } from 'winston';
import { createSheetsRepository } from '../src/repository';
import type { TableConfig } from '../src/types/config';

const logger = createLogger({
  level: 'info',
  format: format.json(),
  transports: [new transports.Console()],
});

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
    columns: [
      { columnIndex: 0, attributeName: 'id', type: 'string' },
      { columnIndex: 1, attributeName: 'name', type: 'string' },
      { columnIndex: 2, attributeName: 'email', type: 'string' },
      { columnIndex: 3, attributeName: 'numberOfChildren', type: 'number' },
      { columnIndex: 4, attributeName: 'createdAt', type: 'date' },
    ],
  };
  // Initialize repository and service
  const userRepository = await createSheetsRepository<User>(sheets, userTableConfig);

  // Create user
  const id = crypto.randomUUID();
  await userRepository.insert({
    id,
    name: 'John Doe',
    email: 'john@example.com',
    numberOfChildren: 2,
    createdAt: new Date(),
  });
  logger.info('New user created');

  // // Find all users
  // const users = await userRepository.findAll();
  // logger.info('All Users', { length: users });

  // Find user
  const user = await userRepository.findBy({ id: '333' });
  logger.info('User found', { user });

  // // Search users
  // const usersFoundBy = await userRepository.findBy({ name: 'John Doe' });
  // logger.info('Users found', usersFoundBy);

  // // Update user
  // const updatedUser = await userRepository.update('1', { name: 'Jane Doe' });
  // logger.info('User updated', updatedUser);

  // // Delete user
  // const deleted = await userRepository.delete('1');
  // logger.info('User deleted', deleted);
};

example();
