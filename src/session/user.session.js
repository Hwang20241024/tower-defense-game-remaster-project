import User from '../classes/models/user.class.js';
import { userSessions } from './session.js';

export const addUser = (socket, id, highScore, rating, sequence) => {
  const user = new User(socket, id, highScore, rating,  sequence);
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
