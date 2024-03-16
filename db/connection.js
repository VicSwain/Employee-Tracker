const { Pool } = require('pg');

const pool = new Pool(
    {
        user: 'postgres',
        password: '3082',
        host: 'localhost',
        database: 'employees_db'
    },
    console.log('Successfullly connected to employees_db!')
);

module.exports = pool;