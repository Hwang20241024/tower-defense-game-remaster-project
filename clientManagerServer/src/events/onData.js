export const onData = (socket) => async (data) => {
  if (!data) {
    console.log('Data is undefined or null');
    return;
  }
  socket.buffer = Buffer.concat([socket.buffer, data]);
};
