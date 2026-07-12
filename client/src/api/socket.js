import { io } from 'socket.io-client';

const URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const socket = io(URL, { autoConnect: false });

const connect = () => {
  const token = localStorage.getItem('token');
  if (token) socket.auth = { token };
  if (!socket.connected) socket.connect();
};

const disconnect = () => {
  try { socket.disconnect(); } catch (e) { }
};

export default socket;
export { connect, disconnect };
