import { io } from 'socket.io-client';

const URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const socket = io(URL, { autoConnect: false });

const connect = () => {
  if (!socket.connected) socket.connect();
};

const disconnect = () => {
  if (socket.connected) socket.disconnect();
};

export default socket;
export { connect, disconnect };
