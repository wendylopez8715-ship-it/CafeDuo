import mysql from 'mysql2/promise';

const database = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'cafe_duo',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default database;