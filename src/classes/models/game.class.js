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
    return findMonsters.find((monster) => monster.id === monsterId);
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

  // 게임 시작
  startGame() {
    // base position 설정
    // monsterPath 생성
  }

  // 매치가 시작되었음을 알림
  matchStartNotification() {
    // 초기 상태 로드
    const initialGameState = {
      baseHp: config.ingame.baseHp,
      towerCost: config.ingame.towerCost,
      initialGold: config.ingame.initialGold,
      monsterSpawnInterval: config.ingame.monsterInterval,
    };

    const userDatas = new Map();

    // 유저 데이터 초기화
    for (var [socket, user] of this.users) {
      // 유저 상태 동기화 인터벌 추가
      this.intervalManager.addPlayer(socket, user.syncStateNotification.bind(user), 100);

      // 몬스터 패스 생성: 가로 간격 50, 세로 간격 -5~5사이로 무작위로 생성하면 될듯?
      const monsterPaths = [];
      var _y = 350;
      for (var i = 0; i < 1400; i += 50) {
        monsterPaths.push({ x: i, y: _y });
        _y += -10 + Math.random() * 20; // TODO: 하드코딩된 부분
      }

      // 타워 데이터 생성
      const towerDatas = [];

      // 몬스터 데이터 생성
      const monsterDatas = [];

      // 유저 하이스코어 로드
      const highScore = user.highScore;

      const userData = {
        gold: config.ingame.initialGold,
        base: {
          hp: config.ingame.baseHp,
          maxHp: config.ingame.baseHp,
        },
        highScore: highScore,
        towers: towerDatas,
        monsters: monsterDatas,
        monsterLevel: 0,
        score: 0,
        monsterPath: monsterPaths,
        basePosition: {
          x: 1400,
          y: _y,
        },
      };

      userDatas.set(user, userData);
    }

    // 게임에 있는 모든 유저에게 데이터 전송
    for (var [socket, user] of this.users) {
      try {
        const protoMessages = getProtoMessages();
        const GamePacket = protoMessages.towerDefense.GamePacket;

        // userDatas에서 key = user인 데이터는 내 데이터, 아니면 상대 데이터
        let playerData, opponentData;
        for (const [key, value] of userDatas) {
          if (key === user) playerData = value;
          else opponentData = value;
        }

        // 페이로드 작성
        const payload = {
          matchStartNotification: {
            initialGameState,
            playerData,
            opponentData,
          },
        };

        // 페이로드 검증
        const errMsg = GamePacket.verify(payload);
        if (errMsg) {
          throw Error(errMsg);
        }

        // 버퍼 작성 및 전송
        const message = GamePacket.create(payload);
        const buffer = GamePacket.encode(message).finish();
        const matchStartNotificationResponse = createResponse(
          PACKET_TYPE.MATCH_START_NOTIFICATION,
          user.sequence,
          buffer,
        );
        socket.write(matchStartNotificationResponse);
      } catch (error) {
        console.log(error);
      }
    }
  }
}

export default Game;
