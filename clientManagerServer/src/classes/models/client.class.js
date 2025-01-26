import net from 'net';
import { onConnect } from '../../events/onConnect.js';

class Client {
  constructor(serverIp, serverPort) {
    this.ip = serverIp;
    this.port = serverPort;
    this.isConnect = false;
    this.isSingIn = false;
    this.isSingUp = false;
    this.isGame = false;
    this.socket = new net.Socket(); // TCP 소켓 생성

    // 클라이언트 초기화 내용.
    this.clientInitialized();
  }

  // 클라이언트 초기화
  clientInitialized() {
    this.isConnect = true;

    this.connectToServer(); // 서버연결.
  }

  // 클라이언트 삭제
  clientDisconnected() {
    this.socket.end(); // 연결 종료
  }

  // 서버 연결.
  connectToServer() {
    this.socket.connect(this.serverPort, this.serverIp, () => {
      onConnect(this.socket);
    });
  }
}

export default Client;
