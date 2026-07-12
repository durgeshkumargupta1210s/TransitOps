import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { toast } from 'react-hot-toast'

export default function Profile(){
  const { user, setUser } = useContext(AuthContext);
  const [form, setForm] = useState({ name: '', email: '', role: '' });

  useEffect(() => {
    const saved = localStorage.getItem('user');
    const current = saved ? JSON.parse(saved) : user;
    if (current) setForm({ name: current.name || '', email: current.email || '', role: current.role || '' });
  }, [user]);

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const save = (e) => {
    e.preventDefault();
    const updated = { ...(user || {}), ...form };
    localStorage.setItem('user', JSON.stringify(updated));
    setUser(updated);
    toast.success('Profile updated locally');
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="p-6 space-y-6">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xl p-6">
          <div className="text-xs uppercase tracking-[0.28em] text-cyan-500 dark:text-cyan-300">Identity</div>
          <h1 className="text-3xl font-semibold mt-2">Profile</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Review your account identity and update local display information.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form onSubmit={save} className="lg:col-span-2 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold">Edit profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="space-y-2">
                <span className="text-sm text-slate-500 dark:text-slate-400">Display name</span>
                <input value={form.name} onChange={e => update('name', e.target.value)} className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-cyan-400" />
              </label>
              <label className="space-y-2">
                <span className="text-sm text-slate-500 dark:text-slate-400">Email</span>
                <input value={form.email} onChange={e => update('email', e.target.value)} className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-cyan-400" />
              </label>
              <label className="space-y-2 md:col-span-2">
                <span className="text-sm text-slate-500 dark:text-slate-400">Role</span>
                <input value={form.role} onChange={e => update('role', e.target.value)} className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-cyan-400" />
              </label>
            </div>
            <div className="flex items-center gap-3">
              <button type="submit" className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 transition">Save profile</button>
              <button type="button" onClick={() => toast('This profile is stored locally in the hackathon build')} className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700">Info</button>
            </div>
          </form>

          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold">Account summary</h2>
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-950/40 p-4 border border-slate-200 dark:border-slate-800">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Current user</div>
              <div className="mt-2 font-medium">{user?.name || form.name || 'User'}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">{user?.email || form.email || 'No email set'}</div>
              <div className="mt-3 inline-flex px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 text-xs font-semibold">{user?.role || form.role || 'Dispatcher'}</div>
            </div>
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-950/40 p-4 border border-slate-200 dark:border-slate-800 text-sm text-slate-500 dark:text-slate-400">
              This profile card is client-side only. It is ready for a backend user profile endpoint if you want to connect one later.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
