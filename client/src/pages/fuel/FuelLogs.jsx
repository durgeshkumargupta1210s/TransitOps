import React, { useEffect, useState } from 'react'
import api from '../../api/axios'

export default function FuelLogs(){
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ vehicle: '', liters: 0, cost: 0, date: '' });
  const load = async ()=>{ try{ const res = await api.get('/fuel'); setItems(res.data.items || res.data); }catch(err){} }
  useEffect(()=>{ load(); },[]);
  const onSave = async ()=>{ await api.post('/fuel', form); setForm({ vehicle: '', liters: 0, cost: 0, date: '' }); load(); }
  const onDelete = async (id) => { if(!confirm('Delete?')) return; await api.delete(`/fuel/${id}`); load(); }

  return (
    <div className="flex">
      <div className="w-64">{/* sidebar */}</div>
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Fuel Logs</h2>
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
      </div>
    </div>
  )
}
