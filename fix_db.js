const mysql = require('mysql2/promise');

async function fix() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'new_database'
  });

  console.log('Connected to database.');

  try {
    // 1. Create roles table if it doesn't exist (though TypeORM should do this)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS roles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // 2. Insert roles
    const roles = ['ADMIN', 'CONTROLLER OPERATOR', 'COMMENTATOR'];
    for (const role of roles) {
      await connection.query('INSERT IGNORE INTO roles (name) VALUES (?)', [role]);
    }
    console.log('Roles seeded.');

    // 3. Fix user table duplicate entries
    // Often '' (empty string) causes issues with unique constraints.
    // Let's delete users with empty usernames or duplicate usernames keeping the first one.
    console.log('Cleaning up user table...');
    
    // Delete users with empty username
    await connection.query("DELETE FROM user WHERE username = '' OR username IS NULL");
    
    // Keep only one user per username (if duplicates exist)
    await connection.query(`
      DELETE u1 FROM user u1
      INNER JOIN user u2 
      WHERE u1.id > u2.id AND u1.username = u2.username
    `);

    console.log('User table cleaned.');

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await connection.end();
    console.log('Done.');
  }
}

fix();
