import React, { useEffect, useState } from 'react'
import api from '../../api/axios'
import VehicleForm from './VehicleForm'

export default function Vehicles(){
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');

  const load = async (p=1, l=20, s='')=>{
    setLoading(true);
    try{
      const res = await api.get('/vehicles', { params: { page: p, limit: l, search: s } });
      setVehicles(res.data.items || res.data);
      setTotal(res.data.total || (res.data.items? res.data.items.length: (res.data.length||0)));
    }catch(err){}
    setLoading(false);
  }
  useEffect(()=>{ load(1, limit, ''); },[]);

  const onEdit = (v)=>{ setEditing(v); setShowForm(true); }
  const onDelete = async (id)=>{ if(!confirm('Delete?'))return; await api.delete(`/vehicles/${id}`); load(); }

  return (
    <div className="flex">
      <div className="w-64">{/* sidebar placeholder */}</div>
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Vehicles</h2>
          <button onClick={()=>{ setEditing(null); setShowForm(true); }} className="px-3 py-1 bg-blue-600 text-white rounded">Add Vehicle</button>
        </div>
        {showForm && <div className="mb-4 p-4 bg-white rounded shadow"><VehicleForm initial={editing||{}} onSaved={()=>{ setShowForm(false); load(); }} onCancel={()=>setShowForm(false)} /></div>}
        <div className="bg-white rounded shadow overflow-auto">
          <table className="w-full text-left">
            <thead><tr><th className="p-2">Reg</th><th>Model</th><th>Type</th><th>Capacity</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {vehicles.map(v=> (
                <tr key={v._id} className="border-t"><td className="p-2">{v.registrationNumber}</td><td>{v.vehicleModel}</td><td>{v.vehicleType}</td><td>{v.maximumLoadCapacity}</td><td>{v.status}</td><td className="p-2"><button onClick={()=>onEdit(v)} className="mr-2 text-blue-600">Edit</button><button onClick={()=>onDelete(v._id)} className="text-red-600">Delete</button></td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-600">Total: {total}</div>
          <div className="flex items-center space-x-2">
            <select value={limit} onChange={e=>{ setLimit(parseInt(e.target.value)); setPage(1); load(1, parseInt(e.target.value), search); }} className="p-1 border">
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <button disabled={page<=1} onClick={()=>{ setPage(p=>Math.max(1,p-1)); load(Math.max(1,page-1), limit, search); }} className="px-2 py-1 border rounded">Prev</button>
            <div className="px-2">{page}</div>
            <button disabled={vehicles.length<limit} onClick={()=>{ setPage(p=>p+1); load(page+1, limit, search); }} className="px-2 py-1 border rounded">Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}
