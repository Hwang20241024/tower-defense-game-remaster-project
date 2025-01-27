import { v4 as uuidv4 } from 'uuid';
import { config } from '../../config/config.js';
import TowerManager from '../managers/tower.manager.js';
import MonsterManager from '../managers/monster.manager.js';
import { getGameSession, removeGameSession } from '../../session/game.session.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { getProtoMessages } from '../../init/loadProtos.js';
import { decode } from 'jsonwebtoken';
import IntervalManager from '../managers/interval.manager.js';
import { gameOverNotification } from '../../utils/notification/game.notification.js';
import { gameEnd } from '../../handlers/game/monsterAttackBase.handler.js';
import { updateUserScore } from '../../db/user/user.db.js';
import { getUserBySocket } from '../../session/user.session.js';

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

    this.users.set(user.id, user);

    if (this.users.size === config.gameSession.MAX_PLAYERS) {
      this.matchStartNotification();
      this.time = Date.now();
    }
  }

  getTime() {
    return this.time;
  }

  getUser(socket) {
    return this.users.get(socket);
  }

  async removeUser(socket) {
    this.users.delete(socket);

    if (this.users.size < config.gameSession.MAX_PLAYERS) {
      this.state = 'waiting';
    }
    if (this.users.size === 1) {
      const user = getUserBySocket(socket);
      const opponent = user.getOpponent();
      const opponentHighestScore = opponent.highScore;

      // const loseToMe = { isWin: false };
      const winToOpponent = { isWin: true };
      // const losePacketToMe = gameOverNotification(loseToMe, socket);
      const winPacketToOpponent = gameOverNotification(winToOpponent, opponent.socket);

      // socket.write(losePacketToMe);
      this.broadcast(winPacketToOpponent, socket);

      if (opponent.score > opponentHighestScore) {
        user.setHighScore(opponent.score);
        await updateUserScore(opponent.score, opponent.id);
      }

      removeGameSession(this.id); // 게임 세션 삭제
      this.intervalManager.clearAll(); // 모든 인터벌 제거

      // 상대방의 객체를 초기화
      opponent.resetUser();
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
  // broadcast(packet, socket) {
  //   this.users.forEach((user) => {
  //     if (user.getUserSocket() !== socket) {
  //       user.getUserSocket().write(packet);
  //     }
  //   });
  // }

  // 매치가 시작되었음을 알림
  async matchStartNotification() {
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

        const matchStartNotificationResponse = user.createResponse(
          PACKET_TYPE.MATCH_START_NOTIFICATION,
          user.getNextSequence,
          {
            initialGameState,
            playerData,
            opponentData,
          },
          'matchStartNotification',
        );

        sendPacketToMe(matchStartNotificationResponse);

        setTimeout(
          (user, socket) => {
            console.log('timeout :', user.id);
            this.intervalManager.addPlayer(socket, user.syncStateNotification.bind(user), 100);
          },
          1000,
          user,
          socket,
        );
      } catch (error) {
        console.log(error);
      }
    }
    // 게임 종료 인터벌
    this.intervalManager.checkTime(this.id, this.checkGameEnd.bind(this), 100);
  }

  async checkGameEnd() {
    const now = Date.now();

    this.users.forEach(async (user, socket, map) => {
      const elapsedTime = now - this.getTime();
      const userHighestScore = user.highScore;

      if (elapsedTime >= 80000) {
        const winToMe = { isWin: true };

        const winPacketToMe = gameOverNotification(winToMe, socket);

        socket.write(winPacketToMe);

        if (user.score > userHighestScore) {
          user.setHighScore(user.score);
          await updateUserScore(user.score, user.id);
        }

        removeGameSession(this.id); // 게임 세션 삭제
        this.intervalManager.clearAll(); // 모든 인터벌 제거

        // 유저들의 객체를 초기화
        user.resetUser();
      }
    });
  }
}

export default Game;
