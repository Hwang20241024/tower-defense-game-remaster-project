import { config } from '../../config/config.js';

// 소켓 연결 통신 담당 (주로 영속적인 데이터)
class SocketSession {
  #socket; // private 속성을 선언
  constructor(socket) {
    this.#socket = socket;
    this.sequence = 0;
    this.id = null;
    this.rating = null;
    this.highScore = null;
  }

  // socket.write는 이곳에서만 사용
  createResponse() {}

  sendPacket() {}

  syncStateNotification() {
    // const protoMessages = getProtoMessages();
    // const notification = protoMessages.towerDefense.GamePacket;
    // const notificationGamePacket = notification.create({
    //   stateSyncNotification: {
    //     userGold: this.gold,
    //     baseHp: this.baseHp,
    //     monsterLevel: this.monsterLevel,
    //     score: this.score,
    //     TowerData: this.towers,
    //     MonsterData: this.monsters,
    //     message: '상태 동기화 패킷입니다.',
    //   },
    // });

    // const notificationPayload = notification.encode(notificationGamePacket).finish();

    const syncStateNotification = createResponse(
      PACKET_TYPE.STATE_SYNC_NOTIFICATION,
      this.sequence,
      notificationPayload,
    );

    this.#socket.write(syncStateNotification);
  }

  // 유저(소켓) 객체를 기준으로 함수 수정하기
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
        this.#socket.write(matchStartNotificationResponse);

        // 유저 상태 동기화 인터벌 추가
        setTimeout(() => {
          this.intervalManager.addPlayer(socket, user.syncStateNotification.bind(user), 100);
        }, 1000);
      } catch (error) {
        console.log(error);
      }
    }
  }
}
export default SocketSession;
