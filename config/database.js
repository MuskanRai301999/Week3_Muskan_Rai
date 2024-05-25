const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('weather_db', 'postgres', '54321', {
  host: 'localhost',
  dialect: 'postgres',
});

module.exports = sequelize;