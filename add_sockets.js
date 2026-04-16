const fs = require('fs');
const path = require('path');

const files = [
  'all_matches.html',
  'batting_card.html',
  'bowling_panel.html',
  'full_scoreboard.html',
  'run_flow.html'
];

const scriptToInject = `
    <!-- SOCKET CONNECTION LOGIC -->
    <script src="http://localhost:3000/socket.io/socket.io.js"></script>
    <script>
        const socket = io('http://localhost:3000');
        socket.on('connect', () => console.log('Connected to Graphics Server'));
        
        socket.on('graphic_event', (payload) => {
            const currentGraphic = location.pathname.split('/').pop().replace('.html', '');
            
            if (payload.graphic === currentGraphic) {
                console.log('Received payload:', payload);
                if (payload.type === 'show') {
                    if (typeof window.show === 'function') window.show(payload.data);
                } else if (payload.type === 'hide') {
                    if (typeof window.hide === 'function') window.hide();
                } else if (payload.type === 'update') {
                    console.log("Updating graphic...", payload.data);
                    if (typeof window.updateGraphic === 'function') window.updateGraphic(payload.data);
                }
            }
        });
    </script>
</body>`;

for (let file of files) {
  const filePath = path.join(__dirname, 'graphics', file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (!content.includes('socket.io/socket.io.js')) {
      content = content.replace('</body>', scriptToInject);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Injected socket logic into ' + file);
    } else {
      console.log('Socket logic already exists in ' + file);
    }
  } else {
      console.log('File not found: ' + file);
  }
}
