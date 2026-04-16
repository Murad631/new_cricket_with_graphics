const fs = require('fs');
const mysql = require('mysql2/promise');

async function seed() {
  try {
    const sql = fs.readFileSync('cri2.sql', 'utf8');
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      multipleStatements: true
    });
    
    await connection.query('DROP DATABASE IF EXISTS cricket2;');
    await connection.query('CREATE DATABASE cricket2;');
    await connection.query('USE cricket2;');
    await connection.query(sql);
    
    console.log('Seeded successfully!');
    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}
seed();
