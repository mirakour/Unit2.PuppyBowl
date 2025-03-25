// Use the API_URL variable to make fetch requests to the API.
// Replace the placeholder with your cohort name (ex: 2109-UNF-HY-WEB-PT)
const cohortName = "2501-ftb-et-web-pt";
const API_URL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}`;

/**
 * Fetches all players from the API.
 * @returns {Object[]} the array of player objects
 */
const fetchAllPlayers = async () => {
  try {
    // TODO
    const response = await fetch(`${API_URL}/players`);
    const { data } = await response.json();
    return data.players;
  } catch (err) {
    console.error("Uh oh, trouble fetching players!", err);
  }
};

/**
 * Fetches a single player from the API.
 * @param {number} playerId
 * @returns {Object} the player object
 */
const fetchSinglePlayer = async (playerId) => {
  try {
    // TODO
    const response = await fetch(`${API_URL}/players/${playerId}`);
    const { data } = await response.json();
    return data.player;
  } catch (err) {
    console.error(`Oh no, trouble fetching player #${playerId}!`, err);
  }
};

/**
 * Adds a new player to the roster via the API.
 * @param {Object} playerObj the player to add
 * @returns {Object} the player returned by the API
 */
const addNewPlayer = async (playerObj) => {
  try {
    // TODO
    const response = await fetch(`${API_URL}/players`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(playerObj),
    });
    const { data } = await response.json();
    return data.newPlayer;
  } catch (err) {
    console.error("Oops, something went wrong with adding that player!", err);
  }
};

/**
 * Removes a player from the roster via the API.
 * @param {number} playerId the ID of the player to remove
 */
const removePlayer = async (playerId) => {
  try {
    // TODO
    await fetch(`${API_URL}/players/${playerId}`, {
      method: "DELETE",
    });
    const players = await fetchAllPlayers();
    renderAllPlayers(players);
  } catch (err) {
    console.error(
      `Whoops, trouble removing player #${playerId} from the roster!`,
      err
    );
  }
};

/**
 * Updates `<main>` to display a list of all players.
 *
 * If there are no players, a corresponding message is displayed instead.
 *
 * Each player is displayed in a card with the following information:
 * - name
 * - id
 * - image (with alt text of the player's name)
 *
 * Additionally, each card has two buttons:
 * - "See details" button that, when clicked, calls `renderSinglePlayer` to
 *    display more information about the player
 * - "Remove from roster" button that, when clicked, will call `removePlayer` to
 *    remove that specific player and then re-render all players
 *
 * Note: this function should replace the current contents of `<main>`, not append to it.
 * @param {Object[]} playerList - an array of player objects
 */
const renderAllPlayers = (playerList) => {
  // TODO
  const main = document.querySelector("main");
  main.innerHTML = ""; // Clear

  if (playerList.length === 0) {
    main.innerHTML = "<p>No puppies found!</p>";
    return;
  }

  playerList.forEach((player) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <h2>${player.name}</h2>
      <p><strong>ID:</strong> ${player.id}</p>
      <img src="${player.imageUrl}" alt="${player.name}" />
      <div class="card-buttons">
        <button class="details-btn" data-id="${player.id}">See Details</button>
        <button class="delete-btn" data-id="${player.id}">Remove</button>
      </div>
    `;
    main.appendChild(card);
  });

  document.querySelectorAll(".details-btn").forEach((btn) =>
    btn.addEventListener("click", async (e) => {
      const playerId = e.target.dataset.id;
      const player = await fetchSinglePlayer(playerId);
      renderSinglePlayer(player);
    })
  );

  document.querySelectorAll(".delete-btn").forEach((btn) =>
    btn.addEventListener("click", async (e) => {
      const playerId = e.target.dataset.id;
      await removePlayer(playerId);
    })
  );
};

/**
 * Updates `<main>` to display a single player.
 * The player is displayed in a card with the following information:
 * - name
 * - id
 * - breed
 * - image (with alt text of the player's name)
 * - team name, if the player has one, or "Unassigned"
 *
 * The card also contains a "Back to all players" button that, when clicked,
 * will call `renderAllPlayers` to re-render the full list of players.
 * @param {Object} player an object representing a single player
 */
const renderSinglePlayer = (player) => {
  // TODO
  const main = document.querySelector("main");
  main.innerHTML = `
    <div class="single-card">
      <img src="${player.imageUrl}" alt="${player.name}" />
      <h2>${player.name}</h2>
      <p><strong>Breed:</strong> ${player.breed}</p>
      <p><strong>Status:</strong> ${player.status}</p>
      <p><strong>Team:</strong> ${player.team?.name || "Unassigned"}</p>
      <button id="back-btn">Back to All Players</button>
    </div>
  `;

  document.querySelector("#back-btn").addEventListener("click", async () => {
    const players = await fetchAllPlayers();
    renderAllPlayers(players);
  });
};

/**
 * Fills in `<form id="new-player-form">` with the appropriate inputs and a submit button.
 * When the form is submitted, it should call `addNewPlayer`, fetch all players,
 * and then render all players to the DOM.
 */
const renderNewPlayerForm = () => {
  try {
    // TODO
    const form = document.querySelector("#new-player-form");
  form.innerHTML = `
    <h2>Add New Puppy</h2>
    <input type="text" id="name" placeholder="Name" required />
    <input type="text" id="breed" placeholder="Breed" required />
    <input type="text" id="status" placeholder="Status (bench/field)" required />
    <input type="url" id="imageUrl" placeholder="Image URL" required />
    <button type="submit">Add Player</button>
  `;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const player = {
      name: document.querySelector("#name").value,
      breed: document.querySelector("#breed").value,
      status: document.querySelector("#status").value,
      imageUrl: document.querySelector("#imageUrl").value,
    };
    await addNewPlayer(player);
    const players = await fetchAllPlayers();
    renderAllPlayers(players);
    form.reset();
  });
  } catch (err) {
    console.error("Uh oh, trouble rendering the new player form!", err);
  }
};

/**
 * Initializes the app by fetching all players and rendering them to the DOM.
 */
const init = async () => {
  const players = await fetchAllPlayers();
  renderAllPlayers(players);

  renderNewPlayerForm();
};

// This script will be run using Node when testing, so here we're doing a quick
// check to see if we're in Node or the browser, and exporting the functions
// we want to test if we're in Node.
if (typeof window === "undefined") {
  module.exports = {
    fetchAllPlayers,
    fetchSinglePlayer,
    addNewPlayer,
    removePlayer,
    renderAllPlayers,
    renderSinglePlayer,
    renderNewPlayerForm,
  };
} else {
  init();
}
