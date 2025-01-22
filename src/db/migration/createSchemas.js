import fs from 'fs';
import path from 'path';
import pools from '../database.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const executeSqlFile = async (pool, filePath) => {
  // 1. 지정 경로의 파일을 읽는다.
  const sql = fs.readFileSync(filePath, 'utf8');

  // 2. ';' 기준으로 배열 생성 후 존재하는 쿼리 부분만 'filter' 처리
  const queries = sql
    .split(';')
    .map((query) => query.trim())
    .filter((query) => query.length > 0);

  // 3. 쿼리 실행
  for (const query of queries) {
    await pool.query(query);
  }
};

const createSchemas = async () => {
  // 1. 현재 파일 기준으로 sql 경로 구성
  const sqlDir = path.join(__dirname, '../sql');

  try {
    await executeSqlFile(pools.CH5_TEAM, path.join(sqlDir, 'user_db.sql'));
    console.log('데이터베아스 테이블이 성공적으로 생성되었습니다.');
  } catch (error) {
    console.error('데이터베이스 테이블 생성 중 오류가 발생했습니다: ', error);
  }
};

createSchemas()
  .then(() => {
    console.log('마이그레이션이 완료되었습니다.');
    process.exit(0); //프로세스 종료
  })
  .catch((err) => {
    console.error('마이그레이션 중 오류가 발생했습니다: ' + err);
    process.exit(1);
  });
