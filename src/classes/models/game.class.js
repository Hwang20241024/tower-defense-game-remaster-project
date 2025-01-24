import { v4 as uuidv4 } from 'uuid';
import { config } from '../../config/config.js';
import TowerManager from '../managers/tower.manager.js';
import MonsterManager from '../managers/monster.manager.js';
import { removeGameSession } from '../../session/game.session.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { getProtoMessages } from '../../init/loadProtos.js';
import { decode } from 'jsonwebtoken';
import IntervalManager from '../managers/interval.manager.js';

class Game {
  constructor() {
    this.users = new Map();
    this.monsterManager = new MonsterManager();
    this.towerManager = new TowerManager();
    this.intervalManager = new IntervalManager();
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

    if (this.users.size === config.gameSession.MAX_PLAYERS) {
      this.matchStartNotification();
    }
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

  // 수정해야합니다. 레벨
  addMonster(level) {
    this.monsterManager.addMonster(this.id, level);
  }

  getMonster(monsterId) {
    const findMonsters = this.monsterManager.getMonstersArr();
    return findMonsters.find((monster) => monster.monsterId === monsterId);
  }

  // 테스트용
  getMonsters() {
    return this.monsterManager.getMonstersArr();
  }

  removeMonster(monsterId) {
    this.monsterManager.removeMonster(monsterId);
  }
  // 추가.
  getLastMonster() {
    return this.monsterManager.getLastMonster();
  }

  checkIsTowerOwner(socket, towerId) {
    const tower = this.towerManager.towers.get(towerId);

    if (tower.userSocket === socket) return true;
    else return false;
  }

  // 상대방한테만 브로드캐스트
  broadcast(packet, socket) {
    this.users.forEach((user) => {
      if (user.getUserSocket() !== socket) {
        user.getUserSocket().write(packet);
      }
    });
  }
}

export default Game;
