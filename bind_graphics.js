const fs = require('fs');
const path = require('path');

const graphicsDir = path.join(__dirname, 'graphics');

const bindings = {
  'batting_card.html': `
  window.updateGraphic = function(data) {
      if (data && data.batters) {
          const rows = document.querySelectorAll('.batting-row');
          data.batters.forEach((batter, i) => {
              if (rows[i]) {
                  const stats = rows[i].querySelectorAll('.stat-val');
                  if (stats.length >= 5) {
                      stats[0].textContent = batter.runs;
                      stats[1].textContent = batter.balls;
                      stats[2].textContent = batter.fours;
                      stats[3].textContent = batter.sixes;
                      stats[4].textContent = batter.strikeRate;
                  }
              }
          });
      }
      if (data && data.scoreboard) {
          const fVals = document.querySelectorAll('.footer-val');
          if (fVals.length >= 3) {
              fVals[0].textContent = data.scoreboard.total_run;
              fVals[1].textContent = data.scoreboard.currentOverNumber * 6; // Balls approx
              const rr = data.scoreboard.currentOverNumber ? (data.scoreboard.total_run / data.scoreboard.currentOverNumber).toFixed(2) : '0.00';
              fVals[2].textContent = rr;
          }
      }
  };
`,
  'bowling_panel.html': `
  window.updateGraphic = function(data) {
      if (data && data.currentBowler) {
          const stats = document.querySelectorAll('.stat-val');
          if (stats.length >= 4) {
              stats[0].textContent = data.currentBowler.overNumber; // Overs
              stats[1].textContent = data.currentBowler.isMaiden ? 1 : 0; // Maidens
              stats[2].textContent = data.currentBowler.runs; // Runs
              stats[3].textContent = data.currentBowler.wickets; // Wickets
          }
      }
  };
`,
  'all_matches.html': `
  window.updateGraphic = function(data) {
      // Just console log for now, as updating entire lists requires complex DOM generation
      console.log('All Matches Data Received: ', data);
  };
`,
  'run_flow.html': `
  window.updateGraphic = function(data) {
      console.log('Run Flow Data Received: ', data);
      // In a real scenario, this would update the chart/graph data points
  };
`,
  'full_scoreboard.html': `
  window.updateGraphic = function(data) {
      console.log('Full Scoreboard Data Received: ', data);
      if (data.batting) {
         const runs = document.querySelectorAll('.runs-col');
         data.batting.forEach((b, i) => {
             if(runs[i]) runs[i].textContent = b.runs;
         });
      }
  };
`
};

for (const [file, code] of Object.entries(bindings)) {
    const filePath = path.join(graphicsDir, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        if (!content.includes('window.updateGraphic = function')) {
            content = content.replace('</body>', `\n<script>\n${code}\n</script>\n</body>`);
            fs.writeFileSync(filePath, content, 'utf8');
            console.log('Added binding to ' + file);
        } else {
            console.log('Binding already exists in ' + file);
        }
    }
}
