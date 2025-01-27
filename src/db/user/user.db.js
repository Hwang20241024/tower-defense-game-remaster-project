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

export const updateAllUserLoginState = async () => {
  await pools.CH5_TEAM.query(SQL_USER_QUERIES.RESET_USER_LOGIN, [false]);
};

export const updateUserScore = async (score, id) => {
  await pools.CH5_TEAM.query(SQL_USER_QUERIES.UPDATE_USER_SCORE, [score, id]);
};

export const updateUserRating = async (rating, id) => {
  await pools.CH5_TEAM.query(SQL_USER_QUERIES.UPDATE_USER_RATING, [rating, id]);
}

export const transaction = async (callback) => {
  try{
    await pools.CH5_TEAM.beginTransaction();
    await callback();
    await pools.CH5_TEAM.commit();
  }catch(error){
    await pools.CH5_TEAM.rollback();
    throw error;
  }finally{
    pools.CH5_TEAM.releaseConnection();
  }
}