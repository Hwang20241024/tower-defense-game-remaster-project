import express from 'express';
import path from 'path';
import ClientManager from './classes/managers/client.manager.js';

const app = express();
const PORT = 3000;

// 클라이언트 매니저 인스턴스 생성
const clientManager = ClientManager.getInstance();

// JSON 요청 본문을 처리할 수 있도록 설정
app.use(express.json());


// React 정적 파일 경로 설정
const __dirname = path.resolve();
const buildPath = path.join(__dirname, 'client/build');
app.use(express.static(buildPath));

// React 애플리케이션 라우팅
app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
  
  // 서버 실행
  app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT}에서 실행 중입니다.`);
  });