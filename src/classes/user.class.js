class User {
  constructor(socket) {
    this.socket = socket;
    this.towers = [];
  }

  setGameId(gameId) {
    this.gameId = gameId;
  }
}

export default User;
