
const socket = io('http://localhost:3000');
const overGroup = document.getElementById('overSummary');
const arrowEl = document.getElementById('striker_arrow');

let currentStrikerRow = 1;
let crrTimeline = gsap.timeline();
let commentaryTimeline = gsap.timeline();

socket.on('setPlayers', (data) => {
    updatePlayer("player1", data.striker.lastName, data.striker.runs, data.striker.balls);
    updatePlayer("player2", data.nonStriker.lastName, data.nonStriker.runs, data.nonStriker.balls);

    // Auto-sync arrow to Row 1 on fresh player set
    updateArrow();

    document.getElementById('bowler').textContent = data.bowler.lastName;

    overData = Array.isArray(data.bowler.over_state) ? data.bowler.over_state : [];

    document.getElementById("details").textContent = data.inning.batting_short_name + ' v ' + data.inning.bowling_short_name;
    document.getElementById("bowlling_team_name").textContent = data.inning.bowling_short_name;
    document.getElementById("batting_team_name").textContent = data.inning.batting_short_name;

    document.getElementById("bowling_team_image").setAttribute("href", data.inning.bowling_logo);
    document.getElementById("batting_team_image").setAttribute("href", data.inning.batting_logo);

    drowSVG(overData);
    ActivePlayer()
});

socket.on('swictPlayerUpDown', (data) => {
    currentStrikerRow = (currentStrikerRow === 1) ? 2 : 1;
    updateArrow();
});

function updateArrow() {
    if (!arrowEl) return;
    // Layering established in HTML: Arrow is behind text.
    // Row 1 Y position = 75. Row 2 Y position = 135.
    const targetY = (currentStrikerRow === 1) ? 15 : 60;
    gsap.to(arrowEl, { y: targetY, duration: 0.2, ease: "power2.inOut" });
}


function DisabledPlayerBlink() {

    let selectors =
        currentStrikerRow === 1
            ? ["#player1", "#player1_runs", "#player1_balls"]
            : ["#player2", "#player2_runs", "#player2_balls"];

    let elements = selectors.map(s => document.querySelector(s)).filter(Boolean);

    if (elements.length === 0) {
        console.log("No elements found!");
        return;
    }

    gsap.to(elements, {
        opacity: 0.2,
        duration: 0.2,
        repeat: 5,
        yoyo: true,
    });
}



function DisabledPlayer(index) {

    console.log(index);
    if (index === 1) {
        document.getElementById("player1").classList.add("disabled");
        document.getElementById("player1_runs").classList.add("disabled");
        document.getElementById("player1_balls").classList.add("disabled");
    }
    else {
        document.getElementById("player2").classList.add("disabled");
        document.getElementById("player2_runs").classList.add("disabled");
        document.getElementById("player2_balls").classList.add("disabled");

    }
}




function ActivePlayer() {
    document.getElementById("player1").classList.remove("disabled");
    document.getElementById("player1_runs").classList.remove("disabled");
    document.getElementById("player1_balls").classList.remove("disabled");

    document.getElementById("player2").classList.remove("disabled");
    document.getElementById("player2_runs").classList.remove("disabled");
    document.getElementById("player2_balls").classList.remove("disabled");

}

function updatePlayer(id, name, runs, balls) {
    document.getElementById(id).textContent = name;
    document.getElementById(id + "_runs").textContent = runs;
    document.getElementById(id + "_balls").textContent = `(${balls})`;
}

function drowSVG(object = []) {
    // Portion 4 boundary protection
    const maxAreaWidth = 440;
    const startX = 0;
    const boxSize = 40;
    const gap = 5;
    const totalContentWidth = overData.length * (boxSize + gap);

    // Reset scale
    overGroup.setAttribute("transform", "translate(10, 58)");

    if (totalContentWidth > maxAreaWidth) {
        const scale = maxAreaWidth / totalContentWidth;
        overGroup.setAttribute("transform", `translate(10, 58) scale(${scale})`);
    }

    while (overGroup.firstChild) {
        overGroup.removeChild(overGroup.firstChild);
    }

    overData.forEach((ball, index) => {
        let color = '#3576ff';
        const ballStr = String(ball);
        // ───────────── COLORS ─────────────
        if (ballStr === '4') {
            color = '#0e9f11ff';
        } else if (ballStr === '6') {
            color = '#d92738';
        } else if (ballStr === 'W') {
            color = '#300000';
        } else if (ballStr === 'NB' || ballStr === 'WD') {
            color = '#ff9800';
        } else if (ballStr.startsWith('NB+')) {
            color = '#ff9800';
        } else if (ballStr.startsWith('WD+')) {
            color = '#ff9800';
        } else if (ballStr.startsWith('LB')) {
            color = '#000000';
        } else if (ballStr.startsWith('B')) {
            color = '#000000';
        }

        let fontSize = 30;
        if (ballStr === 'W') {
            fontSize = 24;
        } else if (ballStr === 'NB' || ballStr === 'WD') {
            fontSize = 25;
            fontWeight = 700;
            yAdjust = 8;
        } else if (ballStr.startsWith('LB')) {
            fontSize = 20;
            fontWeight = 200;
            yAdjust = 10;
        } else if (ballStr.startsWith('NB+')) {
            fontSize = 17;
            fontWeight = 500;
            yAdjust = 10;
        } else if (ballStr.startsWith('WD+')) {
            fontSize = 17;
            fontWeight = 500;
            yAdjust = 10;
        } else {
            fontSize = 25;
            fontWeight = 200;
            yAdjust = 10;
        }

        const x = startX + index * (boxSize + gap);
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', x);
        rect.setAttribute('y', 0);
        rect.setAttribute('width', boxSize);
        rect.setAttribute('height', boxSize);
        rect.setAttribute('rx', '4');
        rect.setAttribute('fill', color);
        rect.setAttribute('stroke', 'white');
        rect.setAttribute('stroke-opacity', '0.4');

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x + boxSize / 2);
        text.setAttribute('y', boxSize / 2 + 7);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', '#fff');
        text.setAttribute('font-size', fontSize);
        text.setAttribute('font-weight', 'bold');
        text.textContent = ball;

        overGroup.appendChild(rect);
        overGroup.appendChild(text);
    });
}

socket.on('scoreboard', (data) => {
    document.getElementById("total_runs").textContent = data.totalRun || '0';
    document.getElementById("outs").textContent = data.totalWicket || '0';
    document.getElementById("total_overs").textContent = data.overs || '0.0';

    document.getElementById('player1_runs').textContent = data.player1_runs;
    document.getElementById('player2_runs').textContent = data.player2_runs;
    document.getElementById('player1_balls').textContent = `(${data.player1_ball})`;
    document.getElementById('player2_balls').textContent = `(${data.player2_ball})`;

    overData = Array.isArray(data.ball_state) ? data.ball_state : [];
    drowSVG(overData);

    if (data.wicket.playerOutId) {
        DisabledPlayer(data.wicket.outPlayer)

    }
});


// 5-SECOND FADE FOR CRR/RRR
function showStat(labelText, value) {
    const labelEl = document.getElementById('average');
    const numberEl = document.getElementById('averag_calculate');

    if (crrTimeline) crrTimeline.kill();
    crrTimeline = gsap.timeline();

    labelEl.textContent = labelText;
    numberEl.textContent = value;

    crrTimeline
        .to([labelEl, numberEl], { opacity: 1, duration: 0.5 })
        .to({}, { duration: 5 }) // Stay 5 seconds
        .to([labelEl, numberEl], { opacity: 0, duration: 0.5 });
}

socket.on('show-crr', (data) => showStat('CRR', data.currentRunRate));
socket.on('show-rrr', (data) => showStat('RRR', data.requiredRunRate));


// 7-SECOND FADE FOR COMMENTARY
socket.on('dynamicText', (data) => {
    const el = document.getElementById('commentary');

    if (commentaryTimeline) commentaryTimeline.kill();
    commentaryTimeline = gsap.timeline();

    commentaryTimeline
        .to(el, { opacity: 0, duration: 0.3 }) // Fade out old
        .call(() => {
            el.textContent = data.trim();
        })
        .to(el, { opacity: 1, duration: 0.6, ease: "power2.out" }) // Fade in new
        .to({}, { duration: 7 }) // Stay 7 seconds
        .to(el, { opacity: 0, duration: 0.5 }); // Fade out
});



socket.on('show_message', (data) => {

    const el = document.getElementById('commentary');

    if (commentaryTimeline) commentaryTimeline.kill();
    commentaryTimeline = gsap.timeline();

    commentaryTimeline.call(() => {
        el.textContent = data.trim(); // update text
        el.style.opacity = "1";       // make sure it's visible
    });
});

