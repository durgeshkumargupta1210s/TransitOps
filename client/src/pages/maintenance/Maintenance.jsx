import React, { useEffect, useState } from 'react'
import api from '../../api/axios'

export default function Maintenance(){
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ vehicle: '', maintenanceType: '', description: '', cost: 0 });
  const load = async ()=>{ try{ const res = await api.get('/maintenance'); setItems(res.data.items || res.data); }catch(err){ } }
  useEffect(()=>{ load(); },[]);
  const onSave = async ()=>{ await api.post('/maintenance', form); setForm({ vehicle: '', maintenanceType: '', description: '', cost: 0 }); load(); }
  const onClose = async (id) => { await api.post(`/maintenance/${id}/close`); load(); }
  const onDelete = async (id) => { if(!confirm('Delete?')) return; await api.delete(`/maintenance/${id}`); load(); }

  return (
    <div className="flex">
      <div className="w-64">{/* sidebar */}</div>
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Maintenance</h2>
        </div>
        <div className="mb-4 p-4 bg-white rounded shadow">
          <h3 className="font-semibold mb-2">Open Maintenance</h3>
          <div className="grid grid-cols-3 gap-2">
            <input value={form.vehicle} onChange={e=>setForm({...form,vehicle:e.target.value})} placeholder="Vehicle ID" className="p-2 border" />
            <input value={form.maintenanceType} onChange={e=>setForm({...form,maintenanceType:e.target.value})} placeholder="Type" className="p-2 border" />
            <input value={form.cost} onChange={e=>setForm({...form,cost:e.target.value})} placeholder="Cost" className="p-2 border" />
            <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Description" className="col-span-3 p-2 border" />
          </div>
          <div className="mt-2"><button onClick={onSave} className="px-3 py-1 bg-blue-600 text-white rounded">Create</button></div>
        </div>
        <div className="bg-white rounded shadow overflow-auto">
          <table className="w-full text-left">
            <thead><tr><th className="p-2">Vehicle</th><th>Type</th><th>Cost</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {items.map(m=> (
                <tr key={m._id} className="border-t"><td className="p-2">{m.vehicle?.registrationNumber || m.vehicle}</td><td>{m.maintenanceType}</td><td>{m.cost}</td><td>{m.status}</td><td className="p-2">{m.status==='Open' && <button onClick={()=>onClose(m._id)} className="mr-2 text-green-600">Close</button>}<button onClick={()=>onDelete(m._id)} className="text-red-600">Delete</button></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
