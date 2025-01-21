import pools from '../database.js';
import { SQL_USER_QUERIES } from './user.queries.js';

const createUser = async (id, password, email) => {
  await pools.CH5_TEAM.query(SQL_USER_QUERIES.CREATE_USER, [id, password, email]);
};

const findUserById = async (id) => {
  await pools.CH5_TEAM.query(SQL_USER_QUERIES.FIND_USER_BY_ID, [id]);
};
