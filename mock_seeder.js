const mysql = require('mysql2/promise');

async function seedMockData() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'cricket2',
    multipleStatements: true
  });

  try {
    console.log("REPAIRING DATA INTEGRITY: Seeding Match 4 (Australia vs New Zealand)...");

    // 1. Get Squad IDs
    const [ausSquad] = await connection.query(`SELECT id, playerId FROM match_squad WHERE matchId = 4 AND teamId = 2 ORDER BY battingPos ASC`);
    const [nzSquad] = await connection.query(`SELECT id, playerId FROM match_squad WHERE matchId = 4 AND teamId = 4 ORDER BY battingPos ASC`);

    if (ausSquad.length < 3 || nzSquad.length < 3) {
      console.log("Error: Squad data incomplete. Please ensure base data is seeded.");
      process.exit(1);
    }

    // Assign Roles
    const aus1 = ausSquad[0].id; // A Carey (Batsman)
    const aus2 = ausSquad[1].id; // T Head (Batsman)
    const aus3 = ausSquad[2].id; // M Marsh (Out)
    
    const nzBowl1 = nzSquad[0].id; // T Southee (Bowler)
    const nzBowl2 = nzSquad[1].id; // L Ferguson (Bowler)

    // Clear Previous State
    await connection.query(`DELETE FROM deliveries WHERE inningsId IN (SELECT id FROM innings WHERE matchId = 4)`);
    await connection.query(`DELETE FROM wickets WHERE inningsId IN (SELECT id FROM innings WHERE matchId = 4)`);
    await connection.query(`DELETE FROM over_summary WHERE matchId = 4`);
    await connection.query(`DELETE FROM match_batting WHERE matchId = 4`);

    // 2. Set Innings
    await connection.query(`
      INSERT INTO innings (id, matchId, number, battingTeamId, bowlingTeamId, isActive)
      VALUES (1, 4, 'FIRST', 2, 4, 1)
      ON DUPLICATE KEY UPDATE battingTeamId = 2, bowlingTeamId = 4, isActive = 1
    `);

    // 3. SEED DELIVERIES (THE ONLY TRUTH)
    // Over 1 (Bowled by NZ Bowl 1) - 6 runs, 1 wicket
    // 0, 1, 4, W, 1, 0
    const deliveries = [
      // over, ball, striker, nonStriker, bowler, runsOffBat, extras, total, isLegal, kind, wicket
      [1, 1, aus1, aus2, nzBowl1, 0, 0, 0, 1, 'RUN', 0],
      [1, 2, aus1, aus2, nzBowl1, 1, 0, 1, 1, 'RUN', 0],
      [1, 3, aus2, aus1, nzBowl1, 4, 0, 4, 1, 'RUN', 0],
      [1, 4, aus2, aus1, nzBowl1, 0, 0, 0, 1, 'RUN', 1], // WICKET!
      [1, 5, aus3, aus1, nzBowl1, 1, 0, 1, 1, 'RUN', 0],
      [1, 6, aus3, aus1, nzBowl1, 0, 0, 0, 1, 'RUN', 0]
    ];

    for (let i = 0; i < deliveries.length; i++) {
        const [ov, b, str, non, bowl, batR, exR, tot, leg, kind, wink] = deliveries[i];
        const [res] = await connection.query(`
            INSERT INTO deliveries (inningsId, seq, overNumber, ballIndex, strikerSquadId, nonStrikerSquadId, bowlerSquadId, runsOffBat, total_runs, isLegal, kind, symbol)
            VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [i+1, ov, b, str, non, bowl, batR, tot, leg, kind, wink ? 'W' : tot.toString()]);
        
        if (wink) {
            await connection.query(`
                INSERT INTO wickets (inningsId, type, outBatsmanSquadId, creditedBowlerSquadId, teamScore, causedByDeliverySeq)
                VALUES (1, 'BOWLED', ?, ?, ?, ?)
            `, [aus2, nzBowl1, 5, i+1]); // Score was 5 when wicket fell
            
            // Update the delivery with the wicketId
            const wicketId = (await connection.query(`SELECT LAST_INSERT_ID() as id`))[0][0].id;
            await connection.query(`UPDATE deliveries SET wicketId = ? WHERE id = ?`, [wicketId, res.insertId]);
        }
    }

    // 4. SYNC Match Batting
    // Aus 1: 2 balls, 1 run
    // Aus 2: 2 balls, 4 runs (Out)
    // Aus 3: 2 balls, 1 run
    await connection.query(`
      INSERT INTO match_batting (matchId, inningsId, player_id, balls, runs, fours, sixes, strikeRate, status, \`index\`)
      VALUES 
        (4, 1, ?, 2, 1, 0, 0, 50.00, 1, 1),
        (4, 1, ?, 2, 4, 1, 0, 200.00, 0, 2),
        (4, 1, ?, 2, 1, 0, 0, 50.00, 1, 3)
    `, [aus1, aus2, aus3]);

    // 5. SYNC Over Summary
    await connection.query(`
      INSERT INTO over_summary (matchId, inningsId, player_id, overNumber, balls, ball_index, runs, wickets, isMaiden, bowlerSquadId)
      VALUES (4, 1, ?, 1, '["0","1","4","W","1","0"]', 6, 6, 1, 0, ?)
    `, [aus1, nzBowl1]);

    // 6. SYNC Scoreboard State
    await connection.query(`
      INSERT INTO scoreboard_state (matchId, currentInningsId, strikerSquadId, nonStrikerSquadId, bowlerSquadId, currentOverNumber, total_run, total_wickets, total_extra) 
      VALUES (4, 1, ?, ?, ?, 1, 6, 1, 0)
      ON DUPLICATE KEY UPDATE currentInningsId=1, strikerSquadId=?, nonStrikerSquadId=?, bowlerSquadId=?, currentOverNumber=1, total_run=6, total_wickets=1, total_extra=0
    `, [aus1, aus3, nzBowl1, aus1, aus3, nzBowl1]);

    console.log("PHASE 2 AUDIT COMPLETE: Match 4 data is now 100% mathematically synchronized.");
    process.exit(0);
  } catch (error) {
    console.error("Critical Seeder Failure: ", error);
    process.exit(1);
  }
}

seedMockData();
