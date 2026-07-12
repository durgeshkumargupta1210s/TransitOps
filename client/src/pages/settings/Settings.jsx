import React, { useContext, useEffect, useState } from 'react'
import { ThemeContext } from '../../context/ThemeContext'
import { AuthContext } from '../../context/AuthContext'
import { toast } from 'react-hot-toast'

const STORAGE_KEY = 'transitops_settings';

export default function Settings(){
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const [settings, setSettings] = useState({ compactTables: false, emailAlerts: true, realtimeToasts: true, autoRefresh: true });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { setSettings(prev => ({ ...prev, ...JSON.parse(saved) })); } catch (e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const onToggle = (key) => setSettings(prev => ({ ...prev, [key]: !prev[key] }));

  const save = () => toast.success('Settings saved locally');

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="p-6 space-y-6">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xl p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.28em] text-cyan-500 dark:text-cyan-300">Preferences</div>
              <h1 className="text-3xl font-semibold mt-2">Settings</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Control appearance, notifications, and dashboard behavior.</p>
            </div>
            <button onClick={toggleTheme} className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 transition">
              {theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Application Preferences</h2>
            <div className="space-y-4">
              {[
                ['compactTables', 'Compact tables', 'Tighten table spacing for dense data views.'],
                ['emailAlerts', 'Email alerts', 'Enable notification reminders for time-sensitive events.'],
                ['realtimeToasts', 'Realtime toasts', 'Show toast notifications for live activity updates.'],
                ['autoRefresh', 'Auto refresh', 'Refresh dashboard metrics periodically while the tab is open.'],
              ].map(([key, label, desc]) => (
                <label key={key} className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-950/40">
                  <div>
                    <div className="font-medium">{label}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">{desc}</div>
                  </div>
                  <input type="checkbox" checked={settings[key]} onChange={() => onToggle(key)} className="mt-1 h-5 w-5 accent-cyan-500" />
                </label>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-3">
              <button onClick={save} className="px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-cyan-400 dark:text-slate-950 font-semibold">Save preferences</button>
              <button onClick={() => setSettings({ compactTables: false, emailAlerts: true, realtimeToasts: true, autoRefresh: true })} className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700">Reset</button>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold">Workspace</h2>
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-950/40 p-4 border border-slate-200 dark:border-slate-800">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Signed in as</div>
              <div className="mt-2 font-medium">{user?.name || 'User'}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">{user?.email || 'No email available'}</div>
              <div className="mt-3 inline-flex px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 text-xs font-semibold">{user?.role || 'Dispatcher'}</div>
            </div>
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-950/40 p-4 border border-slate-200 dark:border-slate-800 text-sm text-slate-500 dark:text-slate-400">
              Settings are saved locally for this hackathon build.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
