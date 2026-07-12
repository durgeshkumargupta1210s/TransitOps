import React, { createContext, useState, useEffect, useContext } from 'react'
import socket, { disconnect } from '../api/socket'

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  useEffect(()=>{ const u = localStorage.getItem('user'); if (u) setUser(JSON.parse(u)); },[]);
  const logout = async () => {
  try {
    socket.emit("logout");
    disconnect();
  } catch (e) {}

  const refreshToken = localStorage.getItem("refreshToken");

  try {
    if (refreshToken) {
      await fetch(
        `${import.meta.env.VITE_API_URL}/auth/logout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        }
      );
    }
  } catch (e) {
    console.log("Logout API failed:", e);
  }

  localStorage.removeItem("user");
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");

  setUser(null);
};
  return <AuthContext.Provider value={{ user, setUser, logout }}>{children}</AuthContext.Provider>
}
