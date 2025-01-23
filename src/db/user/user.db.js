import pools from '../database.js';
import { SQL_USER_QUERIES } from './user.queries.js';

export const createUser = async (id, password, email) => {
  await pools.CH5_TEAM.query(SQL_USER_QUERIES.CREATE_USER, [id, password, email]);
};

export const findUserById = async (id) => {
  const [rows] = await pools.CH5_TEAM.query(SQL_USER_QUERIES.FIND_USER_BY_ID, [id]);
  return rows[0];
};

export const updateUserLoginState = async (id, loginState) => {
  await pools.CH5_TEAM.query(SQL_USER_QUERIES.UPDATE_USER_LOGIN, [loginState, id]);
};
