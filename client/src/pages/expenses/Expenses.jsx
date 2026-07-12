import React, { useEffect, useState } from 'react'
import api from '../../api/axios'

export default function Expenses(){
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ vehicle: '', type: '', amount: 0, date: '' });
  const load = async ()=>{ try{ const res = await api.get('/expenses'); setItems(res.data.items || res.data); }catch(err){} }
  useEffect(()=>{ load(); },[]);
  const onSave = async ()=>{ await api.post('/expenses', form); setForm({ vehicle: '', type: '', amount: 0, date: '' }); load(); }
  const onDelete = async (id) => { if(!confirm('Delete?')) return; await api.delete(`/expenses/${id}`); load(); }

  return (
    <div className="flex">
      <div className="w-64">{/* sidebar */}</div>
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Expenses</h2>
        </div>
        <div className="mb-4 p-4 bg-white rounded shadow">
          <div className="grid grid-cols-4 gap-2">
            <input value={form.vehicle} onChange={e=>setForm({...form,vehicle:e.target.value})} placeholder="Vehicle ID" className="p-2 border" />
            <input value={form.type} onChange={e=>setForm({...form,type:e.target.value})} placeholder="Type" className="p-2 border" />
            <input value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})} placeholder="Amount" className="p-2 border" />
            <input value={form.date} onChange={e=>setForm({...form,date:e.target.value})} type="date" className="p-2 border" />
          </div>
          <div className="mt-2"><button onClick={onSave} className="px-3 py-1 bg-blue-600 text-white rounded">Add Expense</button></div>
        </div>
        <div className="bg-white rounded shadow overflow-auto">
          <table className="w-full text-left">
            <thead><tr><th className="p-2">Vehicle</th><th>Type</th><th>Amount</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {items.map(e=> (
                <tr key={e._id} className="border-t"><td className="p-2">{e.vehicle?.registrationNumber || e.vehicle}</td><td>{e.type}</td><td>{e.amount}</td><td>{new Date(e.date).toLocaleDateString()}</td><td className="p-2"><button onClick={()=>onDelete(e._id)} className="text-red-600">Delete</button></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
