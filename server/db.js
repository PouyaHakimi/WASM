const { Sequelize } = require('sequelize');

// Create a Sequelize instance to connect to the PostgreSQL database
const sequelize = new Sequelize('demo', 'postgres', 'NI0neTeam', {
    host: 'localhost',
    dialect: 'postgres'
});

module.exports = sequelize;





