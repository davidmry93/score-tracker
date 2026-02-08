let data = JSON.parse(localStorage.getItem("scoreApp")) || {
  games: [],
  current: null
};

function save() {
  localStorage.setItem("scoreApp", JSON.stringify(data));
}

function newGame() {
  const id = Date.now();
  const game = {
    id: id,
    date: new Date().toLocaleString(),
    players: [],
    rounds: []
  };

  data.games.push(game);
  data.current = id;
  save();
  renderGameList();
  render();
}

function getCurrentGame() {
  return data.games.find(g => g.id === data.current);
}

function selectGame() {
  data.current = parseInt(document.getElementById("gameSelect").value);
  save();
  render();
}

function addPlayer() {
  const game = getCurrentGame();
  if (!game) return;

  const name = document.getElementById("playerName").value.trim();
  if (!name) return;

  game.players.push(name);
  document.getElementById("playerName").value = "";
  save();
  render();
}

function addRound() {
  const game = getCurrentGame();
  if (!game || game.players.length === 0) return;

  game.rounds.push(game.players.map(() => 0));
  save();
  render();
}

function updateScore(r, p, val) {
  const game = getCurrentGame();
  game.rounds[r][p] = parseInt(val) || 0;
  save();
  render();
}

function total(p) {
  const game = getCurrentGame();
  return game.rounds.reduce((s, r) => s + r[p], 0);
}

function renderGameList() {
  const select = document.getElementById("gameSelect");
  select.innerHTML = "";

  data.games.forEach(g => {
    select.innerHTML += `
      <option value="${g.id}" ${g.id === data.current ? "selected" : ""}>
        Game ${g.id} - ${g.date}
      </option>`;
  });
}

function render() {
  renderGameList();

  const game = getCurrentGame();
  const t = document.getElementById("table");
  const controls = document.querySelectorAll(".player-control");

  t.innerHTML = "";

  if (!game) return;

  // 🔒 verrouillage joueurs après 1er round
    if (game.rounds.length > 0) {
    controls.forEach(c => {
  c.style.display = "none";
});
    } 
    else {
          controls.forEach(c => {
  c.style.display = "block";
});
    }

  // header
let header = `
<tr class="bg-gray-100 sticky top-0">
  <th class="px-3 py-2 border font-semibold">Tour</th>
`;

game.players.forEach(p => {
  header += `<th class="px-3 py-2 border font-semibold">${p}</th>`;
});

header += "</tr>";
t.innerHTML += header;


// rounds
game.rounds.forEach((round, r) => {

  let row = `<tr class="${r % 2 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50 transition">`;
  row += `<td class="px-3 py-2 border font-medium">${r+1}</td>`;

  round.forEach((s, p) => {
    row += `
    <td class="border px-2 py-1">
      <input
        type="number"
        value="${s}"
        onchange="updateScore(${r},${p},this.value)"
        class="w-20 text-center border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400">
    </td>`;
  });

  row += "</tr>";
  t.innerHTML += row;
});


// total
let totalRow = `
<tr class="bg-gray-200 font-bold">
  <td class="px-3 py-2 border">Total</td>
`;

game.players.forEach((_, p) => {
  totalRow += `<td class="px-3 py-2 border text-blue-700">${total(p)}</td>`;
});

totalRow += "</tr>";
t.innerHTML += totalRow;

}

render();
