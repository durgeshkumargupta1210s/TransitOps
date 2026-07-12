import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import api from '../../api/axios'

export default function DriverForm({ initial = {}, onSaved, onCancel }){
  const { register, handleSubmit, reset } = useForm({ defaultValues: initial });
  useEffect(()=>{ reset(initial); }, [initial]);
  const onSubmit = async (data) => {
    try{
      if (initial._id) await api.put(`/drivers/${initial._id}`, data);
      else await api.post('/drivers', data);
      onSaved && onSaved();
    }catch(err){ alert(err.response?.data?.error || 'Save failed'); }
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <input {...register('name')} placeholder="Name" className="w-full p-2 border" />
      <input {...register('licenseNumber')} placeholder="License Number" className="w-full p-2 border" />
      <input {...register('licenseCategory')} placeholder="Category" className="w-full p-2 border" />
      <input {...register('licenseExpiryDate')} placeholder="Expiry Date" type="date" className="w-full p-2 border" />
      <input {...register('contactNumber')} placeholder="Contact" className="w-full p-2 border" />
      <select {...register('status')} className="w-full p-2 border">
        <option>Available</option>
        <option>On Trip</option>
        <option>Off Duty</option>
        <option>Suspended</option>
      </select>
      <div className="flex space-x-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
      </div>
    </form>
  )
}
