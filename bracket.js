
// === BRACKET.JS ===
// Dynamically fetch and render the playoff bracket

const TEAM_NAME_MAP = {
  NSH: "nashville_predators",
  VAN: "vancouver_canucks",
  VGK: "vegas_golden_knights",
  MIN: "minnesota_wild",
  PHI: "philadelphia_flyers",
  CAR: "carolina_hurricanes",
  MTL: "montreal_canadiens",
  LAK: "los_angeles_kings"
};

const BRACKET_ENDPOINT = "https://script.google.com/macros/s/AKfycbxYPUju_JYSpp_Tv3GbpTBXVNrd-uVjlTRkUuKHBFnR/dev?bracket=1";

document.addEventListener("DOMContentLoaded", () => {
  fetch(BRACKET_ENDPOINT)
    .then(response => response.json())
    .then(data => renderBracket(data))
    .catch(err => {
      document.getElementById("bracket-container").innerHTML = "<p style='color:red;'>Error loading bracket.</p>";
      console.error("Bracket load error:", err);
    });
});

function renderBracket(matches) {
  const rounds = { 1: [], 2: [], 3: [] };
  matches.forEach(match => {
    if (match["Round"]) {
      rounds[match["Round"]].push(match);
    }
  });

  const container = document.getElementById("bracket-container");
  container.innerHTML = `
    <style>
      .bracket { display: flex; gap: 2rem; justify-content: center; margin-top: 2rem; font-family: Arial; }
      .round { display: flex; flex-direction: column; gap: 2rem; }
      .matchup { display: flex; flex-direction: column; align-items: flex-start; border: 1px solid #ccc; padding: 0.5rem; background: #fff; width: 200px; border-radius: 8px; box-shadow: 0 0 6px rgba(0,0,0,0.1); }
      .team { display: flex; align-items: center; gap: 0.5rem; }
      .team img { width: 32px; height: 32px; }
      .winner { font-weight: bold; color: green; }
    </style>
    <div class="bracket">
      ${[1, 2, 3].map(round => `
        <div class="round">
          <h3>Round ${round}</h3>
          ${rounds[round].length > 0 ? rounds[round].map(renderMatchup).join("") : "<p>No data</p>"}
        </div>
      `).join("")}
    </div>
  `;
}

function renderMatchup(match) {
  const teamA = match["Team A"];
  const teamB = match["Team B"];
  const winsA = match["Team A Wins"];
  const winsB = match["Team B Wins"];
  const winnerA = winsA > winsB;

  const imgA = TEAM_NAME_MAP[teamA] ? `/images/${TEAM_NAME_MAP[teamA]}.png` : "";
  const imgB = TEAM_NAME_MAP[teamB] ? `/images/${TEAM_NAME_MAP[teamB]}.png` : "";

  return `
    <div class="matchup">
      <div class="team ${winnerA ? 'winner' : ''}">
        <img src="${imgA}" alt="${teamA}" />
        <span>${teamA} (${winsA})</span>
      </div>
      <div class="team ${!winnerA ? 'winner' : ''}">
        <img src="${imgB}" alt="${teamB}" />
        <span>${teamB} (${winsB})</span>
      </div>
    </div>
  `;
}
