import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { ThemeContext } from '../../context/ThemeContext'

export default function Navbar(){
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <div className="flex items-center justify-between p-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur shadow-sm border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100">
      <div>
        <div className="font-semibold tracking-wide">TransitOps</div>
        <div className="text-xs text-slate-500 dark:text-slate-400">Smart Transport Operations</div>
      </div>
      <div className="flex items-center space-x-4">
        <button onClick={toggleTheme} className="text-sm px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>
        {user && <div className="text-sm text-slate-600 dark:text-slate-300">{user.name} ({user.role})</div>}
        {user && <button onClick={logout} className="text-sm px-3 py-1 rounded-full bg-red-500 text-white hover:bg-red-600">Logout</button>}
      </div>
    </div>
  )
}
