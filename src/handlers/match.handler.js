// 매치를 시작하는 핸들러
export const matchHandler = () => {

}

// 매치가 시작되었음을 알림
export const matchStartNotification = () => {

    const initialGameState = {
        baseHp: 0,
        towerCost: 0,
        initialGold: 0,
        monsterSpawnInterval: 0,
    };

    const towerDatas = [];
    const monsterDatas = [];
    const monsterPaths = [];

    const playerData = {
        gold: 0,
        base: {
            hp: 0,
            maxHp: 0,
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
        gold: 0,
        base: {
            hp: 0,
            maxHp: 0,
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

    return { initialGameState, playerData, opponentData };
}

// 내 상태를 알림
export const stateSyncNotification = () => {
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