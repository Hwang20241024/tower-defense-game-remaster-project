class Tower {
  constructor(id, userSocket, x, y) {
    this.id = id;
    this.userSocket = userSocket;
    this.x = x;
    this.y = y;
  }

  getUserSocket() {
    return this.userSocket;
  }
}

export default Tower;
