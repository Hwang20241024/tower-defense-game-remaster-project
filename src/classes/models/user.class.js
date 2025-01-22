class User {
  constructor(socket) {
    this.socket = socket;
    this.sequence = 0;
  }

  setGameId(gameId) {
    this.gameId = gameId;
  }

  getUserSocket() {
    return this.socket;
  }
}

export default User;
