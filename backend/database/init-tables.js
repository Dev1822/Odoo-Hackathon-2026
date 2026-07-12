require('dotenv').config();
const mysql = require('mysql2/promise');

console.log('🚀 Starting database initialization...');

async function initDatabase() {
  let connection;
  try {
    // 1. Connect to MySQL without database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });
    console.log('✅ Connected to MySQL server');

    // 2. Create database if not exists
    const dbName = process.env.DB_NAME || 'ecosphere';
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log(`✅ Database '${dbName}' ready`);

    // 3. Select the database
    await connection.query(`USE \`${dbName}\``);
    console.log('✅ Using database:', dbName);

    // 4. Create csr_activities table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS csr_activities (
        id VARCHAR(36) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        location VARCHAR(255),
        date DATE NOT NULL,
        time TIME,
        max_participants INT,
        status ENUM('draft', 'open', 'in_progress', 'completed', 'cancelled') DEFAULT 'draft',
        created_by VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ csr_activities table created');

    // 5. Create employee_participation table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS employee_participation (
        id VARCHAR(36) PRIMARY KEY,
        csr_activity_id VARCHAR(36),
        employee_id VARCHAR(255) NOT NULL,
        employee_name VARCHAR(255) NOT NULL,
        department VARCHAR(255),
        gender ENUM('male', 'female', 'other'),
        status ENUM('registered', 'attended', 'completed', 'cancelled') DEFAULT 'registered',
        proof_url TEXT,
        approved BOOLEAN DEFAULT FALSE,
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (csr_activity_id) REFERENCES csr_activities(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ employee_participation table created');

    await connection.end();
    console.log('🎉 Database initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    if (connection) {
      await connection.end();
    }
    process.exit(1);
  }
}

initDatabase();
