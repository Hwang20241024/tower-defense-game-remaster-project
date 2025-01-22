import { gameSessions } from './session.js';
import Game from '../classes/game.class.js';
import { config } from '../config/config.js';

export const addGameSession = () => {
  const session = new Game();
  gameSessions.push(session);
  console.log('게임 세션 생성!');

  return session;
};

export const removeGameSession = (id) => {
  const index = gameSessions.findIndex((session) => session.id === id);
  if (index !== -1) {
    return gameSessions.splice(index, 1)[0];
  }
};

export const removeUserInSession = (socket, gameId) => {
  const session = getGameSession(gameId);
  session.removeUser(socket); // 유저의 인터벌 삭제

  if (session.users.length === 0) {
    removeGameSession(gameId);
  }
};

export const getGameSession = (id) => {
  return gameSessions.find((session) => session.id === id);
};

export const getAllGameSessions = () => {
  return gameSessions;
};

export const getEnableGameSession = () => {
  // 참여 가능한 게임을 찾는다. 참여 가능한 게임이 없으면 새로운 게임을 생성한다.
  const game = gameSessions.find((session) => session.users.length < config.gameSession.MAX_PLAYERS);
  if (!game) game = addGameSession();
  return game;
};
