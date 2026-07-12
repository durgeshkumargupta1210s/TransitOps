import React, { useEffect, useState } from 'react'
import api from '../../api/axios'
import TripForm from './TripForm'

export default function Trips(){
  const [trips, setTrips] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState('');

  const load = async (p=1, l=20, s='')=>{ try{ const res = await api.get('/trips', { params: { page: p, limit: l, search: s } }); setTrips(res.data.items || res.data); }catch(err){} }
  useEffect(()=>{ load(); },[]);

  const onEdit = (t)=>{ setEditing(t); setShowForm(true); }
  const onDelete = async (id)=>{ if(!confirm('Delete?'))return; await api.delete(`/trips/${id}`); load(); }
  const onDispatch = async (id)=>{ await api.post(`/trips/${id}/dispatch`); load(); }
  const onComplete = async (id)=>{ await api.post(`/trips/${id}/complete`, {}); load(); }
  const onCancel = async (id)=>{ await api.post(`/trips/${id}/cancel`); load(); }

  return (
    <div className="flex">
      <div className="w-64">{/* sidebar placeholder */}</div>
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Trips</h2>
          <button onClick={()=>{ setEditing(null); setShowForm(true); }} className="px-3 py-1 bg-blue-600 text-white rounded">New Trip</button>
        </div>
        {showForm && <div className="mb-4 p-4 bg-white rounded shadow"><TripForm initial={editing||{}} onSaved={()=>{ setShowForm(false); load(); }} onCancel={()=>setShowForm(false)} /></div>}
        <div className="bg-white rounded shadow overflow-auto">
          <table className="w-full text-left">
            <thead><tr><th className="p-2">Vehicle</th><th>Driver</th><th>Route</th><th>Weight</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {trips.map(t=> (
                <tr key={t._id} className="border-t"><td className="p-2">{t.vehicle?.registrationNumber}</td><td>{t.driver?.name}</td><td>{t.source} → {t.destination}</td><td>{t.cargoWeight}</td><td>{t.status}</td><td className="p-2">
                  {t.status==='Draft' && <button onClick={()=>onDispatch(t._id)} className="mr-2 text-green-600">Dispatch</button>}
                  {t.status==='Dispatched' && <button onClick={()=>onComplete(t._id)} className="mr-2 text-blue-600">Complete</button>}
                  {t.status!=='Completed' && <button onClick={()=>onCancel(t._id)} className="mr-2 text-red-600">Cancel</button>}
                  <button onClick={()=>onEdit(t)} className="text-blue-600">Edit</button>
                </td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-600"></div>
          <div className="flex items-center space-x-2">
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search route" className="p-2 border rounded" />
            <select value={limit} onChange={e=>{ setLimit(parseInt(e.target.value)); setPage(1); load(1, parseInt(e.target.value), search); }} className="p-1 border">
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <button disabled={page<=1} onClick={()=>{ setPage(p=>Math.max(1,p-1)); load(Math.max(1,page-1), limit, search); }} className="px-2 py-1 border rounded">Prev</button>
            <div className="px-2">{page}</div>
            <button disabled={trips.length<limit} onClick={()=>{ setPage(p=>p+1); load(page+1, limit, search); }} className="px-2 py-1 border rounded">Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}
