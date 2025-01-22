import { v4 as uuidv4 } from 'uuid';
import { config } from '../../config/config.js';

class Game {
  constructor() {
    this.users = [];
    this.monsters = [];
    this.id = uuidv4();
  }

  getGameId() {
    return this.id;
  }

  addUser(user) {
    if (this.users.length >= config.gameSession.MAX_PLAYERS) {
      throw new Error('Game session is full');
    }
    this.users.push(user);
  }

  getUser(socket) {
    return this.users.find((user) => user.socket === socket);
  }

  removeUser(socket) {
    this.users = this.users.filter((user) => user.socket !== socket);
    this.intervalManager.removePlayer(socket);

    if (this.users.length < config.gameSession.MAX_PLAYERS) {
      this.state = 'waiting';
    }
  }

  addMonster(monster) {
    this.monsters.push(monster);
  }

  getMonster(monsterId) {
    return this.monsters.find((monster) => monster.id === monsterId);
  }

  removeMonster(monsterId) {
    this.monsters = this.monsters.filter((monster) => monster.id !== monsterId);
  }

  getMaxLatency() {
    let maxLatency = 0;
    this.users.forEach((user) => {
      maxLatency = Math.max(maxLatency, user.latency);
    });

    return maxLatency;
  }

  // 상대방한테만 브로드캐스트
  broadcast(packet, socket) {
    this.users.forEach((user) => {
      if (user.socket !== socket) {
        user.socket.write(packet);
      }
    });
  }
}

export default Game;
