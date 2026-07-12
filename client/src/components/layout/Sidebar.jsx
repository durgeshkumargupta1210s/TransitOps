import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Sidebar(){
  return (
    <div className="w-64 min-h-screen bg-slate-950 text-slate-100 border-r border-slate-800">
      <div className="p-5">
        <div className="text-lg font-semibold">TransitOps</div>
        <div className="text-xs text-slate-400 mt-1">Operations control center</div>
      </div>
      <nav className="px-3 pb-4">
        <ul className="space-y-1">
          <li><NavLink to="/dashboard" className={({isActive})=>isActive? 'block px-4 py-2 rounded-lg bg-cyan-500/15 text-cyan-300':'block px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-800'}>Dashboard</NavLink></li>
          <li><NavLink to="/vehicles" className={({isActive})=>isActive? 'block px-4 py-2 rounded-lg bg-cyan-500/15 text-cyan-300':'block px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-800'}>Vehicles</NavLink></li>
          <li><NavLink to="/drivers" className={({isActive})=>isActive? 'block px-4 py-2 rounded-lg bg-cyan-500/15 text-cyan-300':'block px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-800'}>Drivers</NavLink></li>
          <li><NavLink to="/trips" className={({isActive})=>isActive? 'block px-4 py-2 rounded-lg bg-cyan-500/15 text-cyan-300':'block px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-800'}>Trips</NavLink></li>
          <li><NavLink to="/maintenance" className={({isActive})=>isActive? 'block px-4 py-2 rounded-lg bg-cyan-500/15 text-cyan-300':'block px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-800'}>Maintenance</NavLink></li>
          <li><NavLink to="/fuel" className={({isActive})=>isActive? 'block px-4 py-2 rounded-lg bg-cyan-500/15 text-cyan-300':'block px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-800'}>Fuel Logs</NavLink></li>
          <li><NavLink to="/expenses" className={({isActive})=>isActive? 'block px-4 py-2 rounded-lg bg-cyan-500/15 text-cyan-300':'block px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-800'}>Expenses</NavLink></li>
          <li><NavLink to="/reports" className={({isActive})=>isActive? 'block px-4 py-2 rounded-lg bg-cyan-500/15 text-cyan-300':'block px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-800'}>Reports</NavLink></li>
          <li><NavLink to="/users" className={({isActive})=>isActive? 'block px-4 py-2 rounded-lg bg-cyan-500/15 text-cyan-300':'block px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-800'}>Users</NavLink></li>
          <li><NavLink to="/profile" className={({isActive})=>isActive? 'block px-4 py-2 rounded-lg bg-cyan-500/15 text-cyan-300':'block px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-800'}>Profile</NavLink></li>
          <li><NavLink to="/settings" className={({isActive})=>isActive? 'block px-4 py-2 rounded-lg bg-cyan-500/15 text-cyan-300':'block px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-800'}>Settings</NavLink></li>
        </ul>
      </nav>
    </div>
  )
}
