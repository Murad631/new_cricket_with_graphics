const mysql = require('mysql2/promise');

async function seed() {
  console.log('Connecting to database...');
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'cricket2'
  });

  console.log('Inserting test sponsor...');
  await connection.execute(
    "INSERT INTO sponsors (name, header, image, tagline, show_count, no_shown, status, charges) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    ['Test Partner', 'OFFICIAL PARTNER', '/graphics/logos/test.png', 'INNOVATING THE GAME', 100, 0, 'active', 0.00]
  );
  
  console.log('Sponsor seeded successfully with ID 1');
  await connection.end();
}

seed().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
