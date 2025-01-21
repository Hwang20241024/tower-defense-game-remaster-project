class User {
  constructor(socket) {
    this.socket = socket;
  }

  setGameId(gameId) {
    this.gameId = gameId;
  }
}

export default User;
