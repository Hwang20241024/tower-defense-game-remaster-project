import { v4 as uuidv4 } from 'uuid';
import { config } from '../config/config.js';

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
    if (this.users.length === config.gameSession.MAX_PLAYERS) {
      matchStartNotification();
    }
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

  // 매치가 시작되었음을 알림
  matchStartNotification() {

    const initialGameState = {
      baseHp: 100,
      towerCost: 100,
      initialGold: 100,
      monsterSpawnInterval: 1,
    };

    const towerDatas = [];
    const monsterDatas = [];
    const monsterPaths = [];

    const playerData = {
      gold: 100,
      base: {
        hp: 100,
        maxHp: 100,
      },
      highScore: 0,
      towers: towerDatas,
      monsters: monsterDatas,
      monsterLevel: 0,
      score: 0,
      monsterPath: monsterPaths,
      basePosition: {
        x: 0,
        y: 0,
      },
    }

    const opponentData = {
      gold: 100,
      base: {
        hp: 100,
        maxHp: 100,
      },
      highScore: 0,
      towers: towerDatas,
      monsters: monsterDatas,
      monsterLevel: 0,
      score: 0,
      monsterPath: monsterPaths,
      basePosition: {
        x: 0,
        y: 0,
      },
    }

    // return { initialGameState, playerData, opponentData };
  }

  // 내 상태를 알림
  stateSyncNotification() {
    const towerDatas = [];
    const monsterDatas = [];

    return {
      userGold: 0,
      baseHp: 0,
      monsterLevel: 0,
      score: 0,
      TowerData: towerDatas,
      MonsterData: monsterDatas,
    }
  }
}

export default Game;
