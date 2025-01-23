import User from '../classes/models/user.class.js';
import { userSessions } from './session.js';

export const addUser = (socket, id, highScore, sequence) => {
  const user = new User(socket, id, highScore, sequence);
  userSessions.set(socket, user);
  return user;
};

export const removeUser = (socket) => {
  userSessions.delete(socket);
};

export const getUserBySocket = (socket) => {
  return userSessions.get(socket);
};

export const getAllUserSessions = () => {
  return userSessions;
};
