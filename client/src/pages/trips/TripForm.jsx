import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import api from '../../api/axios'

export default function TripForm({ initial = {}, onSaved, onCancel }){
  const { register, handleSubmit, reset } = useForm({ defaultValues: initial });
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  useEffect(()=>{ reset(initial); api.get('/vehicles').then(r=>setVehicles(r.data.items||r.data)); api.get('/drivers').then(r=>setDrivers(r.data.items||r.data)); }, [initial]);
  const onSubmit = async (data) => {
    try{
      if (initial._id) await api.put(`/trips/${initial._id}`, data);
      else await api.post('/trips', data);
      onSaved && onSaved();
    }catch(err){ alert(err.response?.data?.error || 'Save failed'); }
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <select {...register('vehicle')} className="w-full p-2 border">
        <option value="">Select vehicle</option>
        {vehicles.map(v=> <option key={v._id} value={v._id}>{v.registrationNumber} ({v.status})</option>)}
      </select>
      <select {...register('driver')} className="w-full p-2 border">
        <option value="">Select driver</option>
        {drivers.map(d=> <option key={d._id} value={d._id}>{d.name} ({d.status})</option>)}
      </select>
      <input {...register('source')} placeholder="Source" className="w-full p-2 border" />
      <input {...register('destination')} placeholder="Destination" className="w-full p-2 border" />
      <input {...register('cargoWeight')} placeholder="Cargo Weight" type="number" className="w-full p-2 border" />
      <input {...register('plannedDistance')} placeholder="Planned Distance" type="number" className="w-full p-2 border" />
      <input {...register('revenue')} placeholder="Revenue" type="number" className="w-full p-2 border" />
      <div className="flex space-x-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
      </div>
    </form>
  )
}
