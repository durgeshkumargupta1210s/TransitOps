import React, { useEffect, useState } from 'react'
import api from '../api/axios'
import Navbar from '../components/layout/Navbar'
import socket, { connect, disconnect } from '../api/socket'

export default function Dashboard(){
  const [kpis, setKpis] = useState(null);
  useEffect(()=>{ api.get('/reports/kpis').then(r=>setKpis(r.data)).catch(()=>{}); },[])
  const [recentLogins, setRecentLogins] = useState([]);

  useEffect(() => {
    connect();
    socket.on('user:login', (data) => {
      setRecentLogins(prev => [data, ...prev].slice(0, 10));
    });
    socket.on('presence:update', (list) => {
      setPresence(list);
    });
    api.get('/presence').then(r => setPresence(r.data.online)).catch(()=>{});
    return () => { socket.off('user:login'); socket.off('presence:update'); disconnect(); };
  }, []);

  const [presence, setPresence] = useState([]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <pre className="mt-4 bg-white p-4 rounded shadow">{JSON.stringify(kpis,null,2)}</pre>
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white rounded p-4 shadow">
            <h3 className="font-semibold mb-2">Recent Sign-ins</h3>
            <ul className="text-sm text-gray-700">
              {recentLogins.length === 0 && <li className="text-gray-400">No recent sign-ins</li>}
              {recentLogins.map((r, idx) => (
                <li key={idx} className="py-1 border-b last:border-b-0">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-medium">{r.name}</div>
                      <div className="text-xs text-gray-500">{r.email} — {r.role}</div>
                    </div>
                    <div className="text-xs text-gray-400">{new Date(r.at).toLocaleTimeString()}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded p-4 shadow">
            <h3 className="font-semibold mb-2">Online Users ({presence.length})</h3>
            <ul className="text-sm text-gray-700">
              {presence.length === 0 && <li className="text-gray-400">No users online</li>}
              {presence.map((p, idx) => (
                <li key={p.socketId || idx} className="py-1 border-b last:border-b-0">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs text-gray-500">{p.email} — {p.role}</div>
                    </div>
                    <div className="text-xs text-gray-400">{new Date(p.lastSeen).toLocaleTimeString()}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}


