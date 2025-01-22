import User from '../classes/user.class.js';
import { userSessions } from './session.js';

export const addUser = (socket) => {
  const user = new User(socket);
  userSessions.push(user);
  return user;
};

export const removeUser = (socket) => {
  const index = userSessions.findIndex((user) => user.socket === socket);
  if (index !== -1) {
    return userSessions.splice(index, 1)[0];
  }
};

export const getUserBySocket = (socket) => {
  return userSessions.find((user) => user.socket === socket);
};
