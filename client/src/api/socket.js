import { io } from "socket.io-client";

const URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5001/api"
).replace("/api", "");

const socket = io(URL, {
  autoConnect: false,
  transports: ["websocket", "polling"],
});

export const connect = () => {
  const token = localStorage.getItem("token");

  if (token) {
    socket.auth = { token };
  }

  if (!socket.connected) {
    socket.connect();
  }
};

export const disconnect = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

export default socket;