import React, { useEffect, useState } from 'react'
import api from '../../api/axios'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const COLORS = ['#8884d8','#82ca9d','#ffc658','#ff7f50','#a4de6c']

export default function Reports(){
  const [fuelEff, setFuelEff] = useState([]);
  const [tripsPerVehicle, setTripsPerVehicle] = useState([]);
  const [kpis, setKpis] = useState(null);

  useEffect(()=>{ api.get('/reports/analytics?type=fuel-efficiency').then(r=>setFuelEff(r.data)).catch(()=>{}); api.get('/reports/analytics?type=trips-per-vehicle').then(r=>setTripsPerVehicle(r.data)).catch(()=>{}); api.get('/reports/kpis').then(r=>setKpis(r.data)).catch(()=>{}); },[])

  const exportCsv = () => { window.open('/api/export/trips/csv','_blank'); }
  const exportPdf = () => { window.open('/api/export/trips/pdf','_blank'); }

  return (
    <div className="flex">
      <div className="w-64">{/* sidebar */}</div>
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Reports</h2>
          <div>
            <button onClick={exportCsv} className="mr-2 px-3 py-1 bg-gray-200 rounded">Export CSV</button>
            <button onClick={exportPdf} className="px-3 py-1 bg-gray-200 rounded">Export PDF</button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded shadow p-4">
            <h3 className="font-semibold">Fuel Efficiency</h3>
            <ResponsiveContainer width="100%" height={200}><BarChart data={fuelEff}><XAxis dataKey="vehicle" /><YAxis /><Tooltip /><Bar dataKey="efficiency" fill="#8884d8" /></BarChart></ResponsiveContainer>
          </div>

          <div className="bg-white rounded shadow p-4">
            <h3 className="font-semibold">Trips Per Vehicle</h3>
            <ResponsiveContainer width="100%" height={200}><BarChart data={tripsPerVehicle}><XAxis dataKey="_id" /><YAxis /><Tooltip /><Bar dataKey="trips" fill="#82ca9d" /></BarChart></ResponsiveContainer>
          </div>

          <div className="bg-white rounded shadow p-4 col-span-2">
            <h3 className="font-semibold">KPIs</h3>
            <pre className="mt-2">{JSON.stringify(kpis,null,2)}</pre>
          </div>
        </div>
      </div>
    </div>
  )
}
