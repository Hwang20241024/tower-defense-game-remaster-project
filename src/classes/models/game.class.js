import { v4 as uuidv4 } from 'uuid';
import { config } from '../../config/config.js';
import TowerManager from '../managers/tower.manager.js';
import MonsterManager from '../managers/monster.manager.js';
import { removeGameSession } from '../../session/game.session.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { getProtoMessages } from '../../init/loadProtos.js';
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
    return findMonsters.find((monster) => monster.id === monsterId);
  }

  removeMonster(monsterId) {
    this.monsterManager.removeMonster(monsterId);
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

  // 매치가 시작되었음을 알림
  matchStartNotification() {
    // 게임에 있는 모든 유저에게 데이터 전송
    for (var [socket, user] of this.users) {

      // 유저 상태 동기화 인터벌 추가
      this.intervalManager.addPlayer(socket, user.syncStateNotification(), 100);

      // 라운드 수 증가 인터벌 추가

      // 초기 상태
      const initialGameState = {
        baseHp: 100,
        towerCost: 100,
        initialGold: 100,
        monsterSpawnInterval: 1,
      };

      const towerDatas = [];
      const monsterDatas = [];
      const monsterPaths = [];

      // 내 데이터
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
      };

      // 상대 데이터
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
      };

      try {
        const protoMessages = getProtoMessages();
        const S2CMatchStartNotification = protoMessages.towerDefense.GamePacket;
        const message = S2CMatchStartNotification.create({
          matchStartNotification: { initialGameState, playerData, opponentData },
        });
        const payload = S2CMatchStartNotification.encode(message).finish();
        console.log(payload);
        const decodedMessage = S2CMatchStartNotification.decode(payload);
        console.log(decodedMessage);
        const matchStartNotificationResponse = createResponse(
          PACKET_TYPE.MATCH_START_NOTIFICATION,
          user.sequence,
          payload,
        );
        socket.write(matchStartNotificationResponse);
      } catch (error) {
        console.log(error);
      }
    }
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
    };
  }
}

export default Game;
