class User {
  constructor(socket) {
    this.socket = socket;
    this.sequence = 0;
    this.baseHp = 100;
  }

  setGameId(gameId) {
    this.gameId = gameId;
  }

  getGameId() {
    return this.gameId;
  }

  getUserSocket() {
    return this.socket;
  }
}

export default User;
