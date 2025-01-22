import { v4 as uuidv4 } from 'uuid';
import { config } from '../../config/config.js';
import TowerManager from '../managers/tower.manager.js';
import { removeGameSession } from '../../session/game.session.js';
import { getUserBySocket } from '../../session/user.session.js';

class Game {
  constructor() {
    this.users = new Map();
    this.monsters = [];
    this.towerManager = new TowerManager();
    this.id = uuidv4();
  }

  getGameId() {
    return this.id;
  }

  addUser(user) {
    if (this.users.size >= config.gameSession.MAX_PLAYERS) {
      throw new Error('Game session is full');
    }

    const userSocket = user.getUserSocket();

    this.users.set(userSocket, user);
  }

  getUser(socket) {
    return this.users.get(socket);
  }

  removeUser(socket) {
    this.users.delete(socket);

    if (this.users.size < config.gameSession.MAX_PLAYERS) {
      this.state = 'waiting';
    }
    if (this.users.size === 0) {
      removeGameSession(this.id);
    }

    return this.users.size;
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

  checkIsTowerOwner(socket, towerId) {
    const tower = this.towerManager.towers.get(towerId);

    if (tower.socket === socket) return true;
    else return false;
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
