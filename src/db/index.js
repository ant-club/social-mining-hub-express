import Sequelize from 'sequelize';
import models, { SOCIAL_ACCOUNT_PROVIDER } from './model';

const {
  DB_HOST, DB_NAME, DB_USER, DB_PASS,
} = process.env;

const db = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  dialect: 'mariadb',
  dialectOptions: {
    timezone: 'Etc/GMT0',
  },
  logging: false,
});

const Models = models(db);

export {
  db,
  Models,
  SOCIAL_ACCOUNT_PROVIDER,
};
