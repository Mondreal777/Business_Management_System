require('dotenv').config();

const db = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || '',
	timezone: process.env.TIMEZONE,
    pool: {
      max: 15,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
}

const environment = {
    env: process.env.environment,
    production_mode: process.env.production_mode
}

const servers = {
	API_SERVER_NAME: process.env.SERVER_NAME,
	WEB_SERVER_NAME: process.env.WEB_SERVER_NAME
}

const JWT_USER = {
	TOKEN_KEY: process.env.API_SECRET
}

module.exports = { db, environment, servers, JWT_USER };