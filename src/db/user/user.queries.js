export const SQL_USER_QUERIES = {
  FIND_USER_BY_ID: 'SELECT * FROM user WHERE id = ?',
  CREATE_USER: 'INSERT INTO user (id, password, email) VALUES (?,?,?)',
  UPDATE_USER_LOGIN: 'UPDATE user SET isLogin = ? WHERE id = ?',
  RESET_USER_LOGIN: 'UPDATE user SET isLogin = ? WHERE isLogin = true',
  UPDATE_USER_SCORE: 'UPDATE user SET score = ? WHERE id = ?',
  UPDATE_USER_RATING: `UPDATE user SET rating = ? WHERE id = ?`,
};
