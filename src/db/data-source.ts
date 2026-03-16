import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

// Load .env file into process.env
dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: ['dist/**/*.entity.js'], // Use compiled JS files for migrations
  migrations: ['dist/db/migrations/*.js'],
  synchronize: false, // Must be false for migrations
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
