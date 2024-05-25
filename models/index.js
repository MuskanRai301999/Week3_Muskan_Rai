const sequelize = require('../config/database');
const Weather = require('./weather');

sequelize.sync({ force: false }).then(() => {
  console.log('Database & tables created!');
});

module.exports = {
  Weather,
};