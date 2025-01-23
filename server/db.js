
const { Sequelize } = require('sequelize');

// Create a Sequelize instance to connect to the PostgreSQL database
const sequelize = new Sequelize('demo', 'postgres', 'NI0neTeam', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false, // Disable logging to improve performance; enable if needed for debugging
    pool: {
        max: 10, // Maximum number of connections in the pool
        min: 0,  // Minimum number of connections in the pool
        acquire: 3600000, // The maximum time (in ms) to try getting a connection before throwing an error (60 minutes)
        idle: 60000, // The maximum time (in ms) that a connection can be idle before being released
    },
    dialectOptions: {
        connectTimeout: 3600000, // The maximum time (in ms) to wait for the database connection (60 minutes)
    },
    define: {
        timestamps: false, // Disable automatic timestamp fields (createdAt, updatedAt) if not needed
    }
});

module.exports = sequelize;





