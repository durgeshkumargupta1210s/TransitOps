import React, { useEffect, useState } from 'react'
import api from '../../api/axios'

export default function FuelLogs(){
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ vehicle: '', liters: 0, cost: 0, date: '' });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  const load = async (p = page, l = limit, s = search)=>{ try{ const res = await api.get('/fuel', { params: { page: p, limit: l, search: s } }); setItems(res.data.items || res.data); setTotal(res.data.total || 0); }catch(err){} }
  useEffect(()=>{ load(1, limit, search); },[]);
  const onSave = async ()=>{ await api.post('/fuel', form); setForm({ vehicle: '', liters: 0, cost: 0, date: '' }); load(); }
  const onDelete = async (id) => { if(!confirm('Delete?')) return; await api.delete(`/fuel/${id}`); load(); }

  return (
    <div className="flex">
      <div className="w-64">{/* sidebar */}</div>
      <div className="flex-1 p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-4">
          <h2 className="text-xl font-bold">Fuel Logs</h2>
          <div className="flex flex-wrap gap-2">
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search vehicle, liters, cost" className="p-2 border rounded" />
            <select value={limit} onChange={e=>{ const v=parseInt(e.target.value); setLimit(v); setPage(1); load(1, v, search); }} className="p-2 border rounded">
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <button onClick={()=>load(1, limit, search)} className="px-3 py-2 bg-slate-900 text-white rounded">Apply</button>
          </div>
        </div>
        <div className="mb-4 p-4 bg-white rounded shadow">
          <div className="grid grid-cols-4 gap-2">
            <input value={form.vehicle} onChange={e=>setForm({...form,vehicle:e.target.value})} placeholder="Vehicle ID" className="p-2 border" />
            <input value={form.liters} onChange={e=>setForm({...form,liters:e.target.value})} placeholder="Liters" className="p-2 border" />
            <input value={form.cost} onChange={e=>setForm({...form,cost:e.target.value})} placeholder="Cost" className="p-2 border" />
            <input value={form.date} onChange={e=>setForm({...form,date:e.target.value})} type="date" className="p-2 border" />
          </div>
          <div className="mt-2"><button onClick={onSave} className="px-3 py-1 bg-blue-600 text-white rounded">Add Fuel</button></div>
        </div>
        <div className="bg-white rounded shadow overflow-auto">
          <table className="w-full text-left">
            <thead><tr><th className="p-2">Vehicle</th><th>Liters</th><th>Cost</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {items.map(f=> (
                <tr key={f._id} className="border-t"><td className="p-2">{f.vehicle?.registrationNumber || f.vehicle}</td><td>{f.liters}</td><td>{f.cost}</td><td>{new Date(f.date).toLocaleDateString()}</td><td className="p-2"><button onClick={()=>onDelete(f._id)} className="text-red-600">Delete</button></td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
          <div>Total: {total}</div>
          <div className="flex items-center gap-2">
            <button disabled={page<=1} onClick={()=>{ const next = Math.max(1, page-1); setPage(next); load(next, limit, search); }} className="px-3 py-2 border rounded disabled:opacity-50">Prev</button>
            <div>Page {page}</div>
            <button disabled={items.length < limit} onClick={()=>{ const next = page + 1; setPage(next); load(next, limit, search); }} className="px-3 py-2 border rounded disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}
