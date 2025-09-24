import 'dotenv/config';
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  dialect: process.env.DATABASE_DIALECT,       
  database: process.env.DATABASE_NAME,         
  username: process.env.DATABASE_USERNAME,    
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT) || 5432,
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

try {
  await sequelize.authenticate();
  console.log('Database connection successful');
} catch (error) {
  console.error('Database connection error:', error.message);
  process.exit(1);
}

export default sequelize;