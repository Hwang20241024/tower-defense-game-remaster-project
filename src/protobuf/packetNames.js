export const packetNames = {
  towerDefense: {
    // 전역 실패 코드 (GlobalFailCode) 정의
    GlobalFailCode: 'towerDefense.GlobalFailCode',

    // 게임 내 좌표 데이터 (Position)
    Position: 'towerDefense.Position',

    // 기지 상태 데이터 (BaseData)
    BaseData: 'towerDefense.BaseData',

    // 타워 데이터 (TowerData)
    TowerData: 'towerDefense.TowerData',

    // 몬스터 데이터 (MonsterData)
    MonsterData: 'towerDefense.MonsterData',

    // 게임 초기 상태 (InitialGameState)
    InitialGameState: 'towerDefense.InitialGameState',

    // 게임 상태 (GameState)
    GameState: 'towerDefense.GameState',

    // 클라이언트 -> 서버 회원가입 요청 (C2SRegisterRequest)
    C2SRegisterRequest: 'towerDefense.C2SRegisterRequest',

    // 서버 -> 클라이언트 회원가입 응답 (S2CRegisterResponse)
    S2CRegisterResponse: 'towerDefense.S2CRegisterResponse',

    // 클라이언트 -> 서버 로그인 요청 (C2SLoginRequest)
    C2SLoginRequest: 'towerDefense.C2SLoginRequest',

    // 서버 -> 클라이언트 로그인 응답 (S2CLoginResponse)
    S2CLoginResponse: 'towerDefense.S2CLoginResponse',

    // 클라이언트 -> 서버 매칭 요청 (C2SMatchRequest) ============================ [비어있음]
    C2SMatchRequest: 'towerDefense.C2SMatchRequest',

    // 서버 -> 클라이언트 매칭 시작 알림 (S2CMatchStartNotification)
    S2CMatchStartNotification: 'towerDefense.S2CMatchStartNotification',

    // 서버 -> 클라이언트 게임 상태 동기화 알림 (S2CStateSyncNotification)
    S2CStateSyncNotification: 'towerDefense.S2CStateSyncNotification',

    // 클라이언트 -> 서버 타워 구매 요청 (C2STowerPurchaseRequest)
    C2STowerPurchaseRequest: 'towerDefense.C2STowerPurchaseRequest',

    // 서버 -> 클라이언트 타워 구매 응답 (S2CTowerPurchaseResponse)
    S2CTowerPurchaseResponse: 'towerDefense.S2CTowerPurchaseResponse',

    // 서버 -> 클라이언트 적 타워 추가 알림 (S2CAddEnemyTowerNotification)
    S2CAddEnemyTowerNotification: 'towerDefense.S2CAddEnemyTowerNotification',

    // 클라이언트 -> 서버 몬스터 생성 요청 (C2SSpawnMonsterRequest) ============== [비어있음]
    C2SSpawnMonsterRequest: 'towerDefense.C2SSpawnMonsterRequest',

    // 서버 -> 클라이언트 몬스터 생성 응답 (S2CSpawnMonsterResponse)
    S2CSpawnMonsterResponse: 'towerDefense.S2CSpawnMonsterResponse',

    // 서버 -> 클라이언트 적 몬스터 생성 알림 (S2CSpawnEnemyMonsterNotification)
    S2CSpawnEnemyMonsterNotification: 'towerDefense.S2CSpawnEnemyMonsterNotification',

    // 클라이언트 -> 서버 타워 공격 요청 (C2STowerAttackRequest)
    C2STowerAttackRequest: 'towerDefense.C2STowerAttackRequest',

    // 서버 -> 클라이언트 적 타워 공격 알림 (S2CEnemyTowerAttackNotification)
    S2CEnemyTowerAttackNotification: 'towerDefense.S2CEnemyTowerAttackNotification',

    // 클라이언트 -> 서버 몬스터가 기지를 공격하는 요청 (C2SMonsterAttackBaseRequest)
    C2SMonsterAttackBaseRequest: 'towerDefense.C2SMonsterAttackBaseRequest',

    // 서버 -> 클라이언트 기지 HP 업데이트 알림 (S2CUpdateBaseHPNotification)
    S2CUpdateBaseHPNotification: 'towerDefense.S2CUpdateBaseHPNotification',

    // 서버 -> 클라이언트 게임 오버 알림 (S2CGameOverNotification)
    S2CGameOverNotification: 'towerDefense.S2CGameOverNotification',

    // 클라이언트 -> 서버 게임 종료 요청 (C2SGameEndRequest) ==================== [비어있음]
    C2SGameEndRequest: 'towerDefense.C2SGameEndRequest',

    // 클라이언트 -> 서버 몬스터 사망 알림 (C2SMonsterDeathNotification)
    C2SMonsterDeathNotification: 'towerDefense.C2SMonsterDeathNotification',

    // 서버 -> 클라이언트 적 몬스터 사망 알림 (S2CEnemyMonsterDeathNotification)
    S2CEnemyMonsterDeathNotification: 'towerDefense.S2CEnemyMonsterDeathNotification',

    // 최상위 게임 패킷 (GamePacket)
    GamePacket: 'towerDefense.GamePacket',

    // 공통패킷
    CommonPacket: 'towerDefense.CommonPacket',
  },
  // 새로운 프로토 파일이 추가되면 여기에 새로운 항목 추가
};
