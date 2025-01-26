import Client from "../models/client.class.js";


export default class ClientManager {
  static instance = null;

  constructor() {
    if (ClientManager.instance) {
      throw new Error('ClientManager는 싱글턴 클래스입니다. getInstance()를 사용하세요.');
    }
    this.client = [];
    this.serverIp = 0;
    this.serverPort = 0;
    this.clientLimit = 0;
    this.serverIsInitialized = false;
    

    ClientManager.instance = this; // 인스턴스를 static 변수에 저장
  }

  static getInstance() {
    if (!ClientManager.instance) {
      ClientManager.instance = new ClientManager();
    }

    return ClientManager.instance;
  }

  // 서버 세팅.
  serverInitialized(serverIp, serverPort, clientLimit) {
    if(!this.serverIsInitialized) {
      this.serverIp = serverIp;
      this.serverPort = serverPort;
      this.clientLimit = clientLimit;

      this.serverIsInitialized = true;
    }
  }

  // 클라이언트 셋팅.
  addClient(clientLimit) {
    if(this.serverIsInitialized) {
      for(let i = 0; i < this.clientLimit; i++){
        this.client.push(new Client)
      }
    }
  }
}
