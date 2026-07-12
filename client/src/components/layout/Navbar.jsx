import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'

export default function Navbar(){
  const { user, logout } = useContext(AuthContext);
  return (
    <div className="flex items-center justify-between p-4 bg-white shadow">
      <div className="font-bold">TransitOps</div>
      <div className="flex items-center space-x-4">
        {user && <div>{user.name} ({user.role})</div>}
        {user && <button onClick={logout} className="text-sm text-red-600">Logout</button>}
      </div>
    </div>
  )
}
