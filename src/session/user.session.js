import User from '../classes/models/user.class.js';
import { userSessions } from './session.js';

export const addUser = (socket) => {
  const user = new User(socket);
  userSessions.set(socket, user);
  return user;
};

export const removeUser = (socket) => {
  userSessions.delete(socket);
};

export const getUserBySocket = (socket) => {
  return userSessions.get(socket);
};
