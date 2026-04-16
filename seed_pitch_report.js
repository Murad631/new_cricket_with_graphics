const mysql = require('mysql2/promise');

async function seed() {
  console.log('Connecting to database...');
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'cricket2'
  });

  console.log('Upserting test pitch report...');
  // We use REPLACE or DELETE+INSERT to ensure we have a clean test record
  await connection.execute("DELETE FROM pitch_reports WHERE matchId = 4 AND inningsId = 7");
  
  await connection.execute(
    "INSERT INTO pitch_reports (matchId, inningsId, grassCover, turnProjection, paceBounce, pitchType, boundaries, avgScore, matchType) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [4, 7, 8.5, 4.0, 7.5, 'Hard Surface', '75m Uniform', '175 Runs', 'Night / Dew']
  );
  
  console.log('Pitch Report seeded successfully for Match 4 / Inning 7');
  await connection.end();
}

seed().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
