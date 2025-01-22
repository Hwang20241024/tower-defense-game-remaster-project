// 서버 초기화 작업
import { loadProtos } from "./loadProtos.js";
import MonsterManager from "../classes/managers/monster.manager.js";

const initServer = async () => {
  try {
    // 초기화
    await loadProtos();     // 프로토파일 읽기.
    // 초기화 작업 추가.

  } catch (e) {
    console.error(e);
    process.exit(1); // 오류 발생 시 프로세스 종료
  }
};

export default initServer;
