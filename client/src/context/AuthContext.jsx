import React, { createContext, useState, useEffect, useContext } from 'react'
import socket, { disconnect } from '../api/socket'

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  useEffect(()=>{ const u = localStorage.getItem('user'); if (u) setUser(JSON.parse(u)); },[]);
  const logout = () => { 
    try { socket.emit('logout'); disconnect(); } catch (e) { }
    localStorage.removeItem('user'); localStorage.removeItem('token'); setUser(null); 
  }
  return <AuthContext.Provider value={{ user, setUser, logout }}>{children}</AuthContext.Provider>
}
