import { gameSessions } from './sessions.js';
import Game from '../classes/models/game.class.js';
import { config } from '../config/config.js';

export const addGameSession = () => {
  const session = new Game(); // 게임 객체가 생성될 때 id가 uuid로 생성됨
  const gameId = session.getGameId();
  gameSessions.set(gameId, session);
  console.log('게임 세션 생성!');

  return session;
};

export const removeGameSession = (gameId) => {
  gameSessions.delete(gameId);
};

export const getGameSession = (gameId) => {
  return gameSessions.get(gameId);
};

export const getAllGameSessions = () => {
  return gameSessions;
};

export const getEnableGameSession = () => {
  let result = null;
  gameSessions.forEach((session, key) => {
    if (session.users.size < config.gameSession.MAX_PLAYERS && result === null) {
      result = session;
    }
  });
  return result;
};
