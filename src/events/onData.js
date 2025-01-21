import { getProtoMessages } from "../init/loadProtos.js";
import { getProtoTypeNameByHandlerId } from '../handlers/index.js';

export const onData = (socket) => async (data) => {
  console.log('클라이언트가 데이터를 보냈습니다.');
  // 클라이언트 데이터 처리 로직 추가.
  console.log(data);

  socket.buffer = Buffer.concat([socket.buffer, data]);

  let offset = 0;
  const packetType = socket.buffer.readInt16BE(offset);
  offset += 2;
  console.log(`packetType : ${packetType}`);

  const versionLength = data.readInt8(offset);
  offset += 1;
  console.log(`versionLength : ${versionLength}`);

  const version = data.toString('utf-8', offset, offset + versionLength);
  offset += versionLength;
  console.log(`version : ${version}`);

  const sequence = data.readInt32BE(offset);
  offset += 4;
  console.log(`sequence : ${sequence}`);

  const payloadLength = data.readInt32BE(offset);
  offset += 4;
  console.log(`payloadLength : ${payloadLength}`);

  const payload = data.slice(offset, offset + payloadLength);
  console.log(`payload : ${payload}`);

  const packet = { packetType, versionLength, version, sequence, payloadLength, payload };
  console.log(packet);

  /*
    const protoMessages = getProtoMessages();
    const protoTypeName = getProtoTypeNameByHandlerId(packetType);
    const [namespace, typeName] = protoTypeName.split('.');
  
    const PayloadType = protoMessages[namespace][typeName];
  
    let pl;
    pl = PayloadType.decode(packet.payload);
  
    const id = pl.id;
    const password = pl.password;
    console.log(id, password);
    */
};