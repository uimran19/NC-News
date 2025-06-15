const { Pool } = require("pg");

const ENV = process.env.NODE_ENV || 'development'

require('dotenv').config({path: `${__dirname}/../.env.${ENV}`})
const config = {}

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
    throw new Error("PGDATABASE or DATABASE_URL not set")
}



if(ENV === 'production') {
    config.connectionString = process.env.DATABASE_URL
    config.max = 2
    console.log("Connected to production database");
} else {
    console.log(`Connected to local database: ${process.env.PGDATABASE}`)
}

const db = new Pool(config);

module.exports = db;