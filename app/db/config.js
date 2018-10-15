module.exports = {
  development: {
    database: 'database_development',
    username: null,
    password: null,
    dialect: 'sqlite',
    operatorsAliases: false,
    storage: './database_development.db'
  },
  test: {
    database: 'database_test',
    username: null,
    password: null,
    dialect: 'sqlite',
    operatorsAliases: false,
    storage: './database_test.db'
  },
  production: {
    database: 'database_production',
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    dialect: 'sqlite',
    operatorsAliases: false,
    storage: './database_production.db',
    logging: false
  }
};
