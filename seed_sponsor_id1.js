const mysql = require('mysql2/promise');

async function seed() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'cricket2'
  });

  console.log('Force-inserting sponsor with ID 1...');
  // First, we attempt to delete ID 1 in case of a ghost record, then insert fresh.
  await connection.execute("DELETE FROM sponsors WHERE id = 1");
  await connection.execute(
    "INSERT INTO sponsors (id, name, header, image, tagline, show_count, no_shown, status, charges) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [1, 'Main Partner', 'OFFICIAL PARTNER', '/graphics/logos/main.png', 'LEADING THE WAY', 100, 0, 'active', 0.00]
  );
  
  console.log('Sponsor ID 1 has been successfully registered.');
  await connection.end();
}

seed().catch(err => {
  console.error('Seeding blocked:', err);
  process.exit(1);
});
