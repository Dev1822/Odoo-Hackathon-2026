const mysql = require('mysql2/promise');
const { PrismaClient } = require('@prisma/client');

// Create MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'test_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test MySQL connection
pool.getConnection()
  .then((connection) => {
    console.log('Successfully connected to MySQL database.');
    connection.release();
  })
  .catch((err) => {
    console.error('MySQL database connection error:', err.message);
  });

// Initialize Prisma
let prisma;
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

module.exports = { pool, prisma };
