import Game from "../class/models/game.class.js"

sessions = [];

export const addGame = (gameId) => {
    const newGame = new Game(gameId);
    sessions.push(newGame);
}

export const removeGame = (gameId) => {
    sessions == sessions.filter((game) => game.id !== gameId);
}

export const getGameByGameId = (gameId) => {
    return sessions.find((game) => game.id === gameId);
}

export const getGames = () => {
    return sessions;
}