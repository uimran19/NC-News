const { Pool } = require("pg");

const ENV = process.env.NODE_ENV || 'development'

require('dotenv').config({path: `${__dirname}/../.env.${ENV}`})
const config = {}
const db = new Pool(config);

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
    throw new Error("No PGDATABASE configured")
} else { 
    console.log(`Connected to ${process.env.PGDATABASE}`)
}



if(ENV === 'prodction') {
    config.connectionString = process.env.DATABASE_URL
    config.max = 2
}

module.exports = db;