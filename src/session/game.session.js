import { gameSessions } from './session.js';
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

export const getEnableGameSession = (rating) => {
  let result = null;
  
  let min = Infinity;
  gameSessions.forEach((session) => {
    if (session.users.size < config.gameSession.MAX_PLAYERS) {
      let totalRating = 0;
      let userCount = 0;

      session.users.forEach((user) => {
        totalRating += user.rating;
        userCount++;
      });

      if (userCount > 0) {
        const averageRating = totalRating / userCount;
        const difference = Math.abs(averageRating - rating);

        if (difference < min) {
          min = difference;
          result = session;
        }
      }
    }
  });
  if (!result) result = addGameSession();

  return result;
};
