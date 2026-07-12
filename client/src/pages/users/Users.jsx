import React, { useEffect, useState } from 'react'
import api from '../../api/axios'
import { toast } from 'react-hot-toast'

const emptyForm = { name: '', email: '', role: 'Dispatcher', password: '' };

export default function Users(){
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const load = async (params = {}) => {
    try {
      const res = await api.get('/users', { params: { page, limit, search, role, ...params } });
      setItems(res.data.items || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to load users');
    }
  }

  useEffect(() => { load(); }, [page, limit]);

  const onCreate = () => {
    setEditing(null);
    setForm(emptyForm);
  }

  const onEdit = (u) => {
    setEditing(u);
    setForm({ name: u.name || '', email: u.email || '', role: u.role || 'Dispatcher', password: '' });
  }

  const save = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        const payload = { name: form.name, email: form.email, role: form.role };
        if (form.password) payload.password = form.password;
        await api.put(`/users/${editing._id}`, payload);
        toast.success('User updated');
      } else {
        await api.post('/auth/register', form);
        toast.success('User created');
      }
      setEditing(null);
      setForm(emptyForm);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Save failed');
    }
  }

  const remove = async (id) => {
    if (!confirm('Delete this user?')) return;
    try {
      await api.delete(`/users/${id}`);
      toast.success('User deleted');
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Delete failed');
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="p-6 space-y-6">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xl p-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.28em] text-cyan-500 dark:text-cyan-300">Administration</div>
              <h1 className="text-3xl font-semibold mt-2">Users</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Manage internal accounts and roles.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name or email" className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-cyan-400" />
              <select value={role} onChange={e => setRole(e.target.value)} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 outline-none">
                <option value="">All roles</option>
                <option value="Fleet Manager">Fleet Manager</option>
                <option value="Dispatcher">Dispatcher</option>
                <option value="Safety Officer">Safety Officer</option>
                <option value="Financial Analyst">Financial Analyst</option>
              </select>
              <button onClick={() => load({ page: 1 })} className="px-4 py-3 rounded-xl bg-slate-900 text-white dark:bg-cyan-400 dark:text-slate-950 font-semibold">Apply</button>
              <button onClick={onCreate} className="px-4 py-3 rounded-xl bg-cyan-500 text-slate-950 font-semibold">New user</button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <form onSubmit={save} className="xl:col-span-1 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xl p-6 space-y-4 sticky top-6">
            <h2 className="text-lg font-semibold">{editing ? 'Edit user' : 'Create user'}</h2>
            <input value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))} placeholder="Name" className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-cyan-400" />
            <input value={form.email} onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))} placeholder="Email" className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-cyan-400" />
            <select value={form.role} onChange={e => setForm(prev => ({ ...prev, role: e.target.value }))} className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 outline-none">
              <option value="Fleet Manager">Fleet Manager</option>
              <option value="Dispatcher">Dispatcher</option>
              <option value="Safety Officer">Safety Officer</option>
              <option value="Financial Analyst">Financial Analyst</option>
            </select>
            <input value={form.password} onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))} placeholder={editing ? 'New password (optional)' : 'Password'} type="password" className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-cyan-400" />
            <div className="flex gap-3">
              <button type="submit" className="px-4 py-3 rounded-xl bg-cyan-500 text-slate-950 font-semibold flex-1">{editing ? 'Update' : 'Create'}</button>
              <button type="button" onClick={() => { setEditing(null); setForm(emptyForm); }} className="px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700">Clear</button>
            </div>
          </form>

          <div className="xl:col-span-2 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xl overflow-hidden">
            <div className="p-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
              <div className="text-sm text-slate-500 dark:text-slate-400">{total} total users</div>
              <div className="flex items-center gap-2">
                <select value={limit} onChange={e => setLimit(parseInt(e.target.value))} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 outline-none">
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <button disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 disabled:opacity-50">Prev</button>
                <div className="px-2 text-sm">Page {page}</div>
                <button disabled={items.length < limit} onClick={() => setPage(p => p + 1)} className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 disabled:opacity-50">Next</button>
              </div>
            </div>
            <div className="overflow-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-950/50 text-slate-600 dark:text-slate-400 text-sm uppercase tracking-wide">
                  <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(user => (
                    <tr key={user._id} className="border-t border-slate-200 dark:border-slate-800">
                      <td className="p-4 font-medium">{user.name}</td>
                      <td className="p-4 text-slate-500 dark:text-slate-400">{user.email}</td>
                      <td className="p-4">{user.role}</td>
                      <td className="p-4 flex gap-3">
                        <button onClick={() => onEdit(user)} className="text-cyan-600 dark:text-cyan-300">Edit</button>
                        <button onClick={() => remove(user._id)} className="text-red-500">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
