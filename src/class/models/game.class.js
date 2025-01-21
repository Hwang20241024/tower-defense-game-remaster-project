// 게임을 정의한 클래스

class Game{
    constructor(gameId){
        this.id = gameId;
        this.users = [];
    }

    addUser(user){
        this.users.push(user);
    }

    getUser(userId){
        return this.users.find((u) => u.id === userId);
    }

    removeUser(userId){
        return this.users.filter((u) => u.id !== userId);
    }
}

export default Game;