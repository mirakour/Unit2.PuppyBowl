const {
  fetchAllPlayers,
  fetchSinglePlayer,
  addNewPlayer,
  removePlayer,
} = require("./script");

// Global variable to store a test player ID
let testPlayerId;

describe("Puppy Bowl API Functions", () => {

  // FETCH ALL PLAYERS
  describe("fetchAllPlayers", () => {
    test("should return an array of players", async () => {
      const players = await fetchAllPlayers();
      expect(Array.isArray(players)).toBe(true);
      expect(players.length).toBeGreaterThan(0);
    });

    test("players should have required properties", async () => {
      const players = await fetchAllPlayers();
      const player = players[0];
      expect(player).toHaveProperty("id");
      expect(player).toHaveProperty("name");
      expect(player).toHaveProperty("breed");
    });
  });

  // ADD NEW PLAYER
  describe("addNewPlayer", () => {
    const newPlayer = {
      name: "Test Doggo",
      breed: "Test Breed",
      status: "bench",
      imageUrl: "https://placedog.net/400/300?id=123",
    };

    test("should add a new player", async () => {
      const player = await addNewPlayer(newPlayer);
      expect(player).toHaveProperty("id");
      expect(player.name).toBe(newPlayer.name);
      testPlayerId = player.id; // save for cleanup
    });
  });

  // FETCH SINGLE PLAYER
  describe("fetchSinglePlayer", () => {
    test("should return a player object with full details", async () => {
      const player = await fetchSinglePlayer(testPlayerId);
      expect(player).toHaveProperty("id", testPlayerId);
      expect(player).toHaveProperty("breed");
      expect(player).toHaveProperty("status");
      expect(player).toHaveProperty("team");
    });
  });

  // REMOVE PLAYER
  describe("removePlayer", () => {
    test("should remove the test player without error", async () => {
      const result = await removePlayer(testPlayerId);
      expect(result).toBeUndefined(); // no error thrown
    });

    test("should confirm player is deleted", async () => {
      const players = await fetchAllPlayers();
      const exists = players.find((p) => p.id === testPlayerId);
      expect(exists).toBeUndefined();
    });
  });
});


