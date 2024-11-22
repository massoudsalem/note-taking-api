import { jest } from '@jest/globals';
import dotenv from 'dotenv';
import sequelize from '../src/config/database.js';

dotenv.config({ path: '.env.test' });

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});