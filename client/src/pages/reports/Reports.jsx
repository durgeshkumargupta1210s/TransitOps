import React, { useEffect, useState } from 'react'
import api from '../../api/axios'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts'

const COLORS = ['#06b6d4', '#8b5cf6', '#f59e0b', '#ef4444', '#14b8a6', '#10b981']

export default function Reports(){
  const [kpis, setKpis] = useState(null);
  const [reports, setReports] = useState({
    fuelEff: [],
    tripsPerVehicle: [],
    tripsPerDriver: [],
    monthlyExpenses: [],
    expenseDistribution: [],
    maintenanceTrend: [],
    fleetUtilization: [],
    revenueVsCost: [],
    vehicleRoi: [],
  });

  useEffect(() => {
    Promise.all([
      api.get('/reports/analytics?type=fuel-efficiency'),
      api.get('/reports/analytics?type=trips-per-vehicle'),
      api.get('/reports/analytics?type=trips-per-driver'),
      api.get('/reports/analytics?type=monthly-expenses'),
      api.get('/reports/analytics?type=expense-distribution'),
      api.get('/reports/analytics?type=maintenance-trend'),
      api.get('/reports/analytics?type=fleet-utilization'),
      api.get('/reports/analytics?type=revenue-vs-cost'),
      api.get('/reports/analytics?type=vehicle-roi'),
      api.get('/reports/kpis')
    ]).then(([
      fuelEff,
      tripsPerVehicle,
      tripsPerDriver,
      monthlyExpenses,
      expenseDistribution,
      maintenanceTrend,
      fleetUtilization,
      revenueVsCost,
      vehicleRoi,
      kpisResponse,
    ]) => {
      setReports({
        fuelEff: fuelEff.data,
        tripsPerVehicle: tripsPerVehicle.data,
        tripsPerDriver: tripsPerDriver.data,
        monthlyExpenses: monthlyExpenses.data,
        expenseDistribution: expenseDistribution.data,
        maintenanceTrend: maintenanceTrend.data,
        fleetUtilization: fleetUtilization.data,
        revenueVsCost: revenueVsCost.data,
        vehicleRoi: vehicleRoi.data,
      });
      setKpis(kpisResponse.data);
    }).catch(() => {});
  }, [])

  const exportCsv = () => { window.open('/api/export/trips/csv', '_blank'); }
  const exportPdf = () => { window.open('/api/export/trips/pdf', '_blank'); }

  const pieFleet = reports.fleetUtilization.map((item) => ({ name: item._id, value: item.count }))
  const pieExpense = reports.expenseDistribution.map((item) => ({ name: item._id, value: item.total }))
  const revenueVsCost = [
    { name: 'Revenue', value: kpis?.vehicleRoi || 0 },
    { name: 'Fuel', value: kpis?.fuelCost || 0 },
    { name: 'Maintenance', value: kpis?.maintenanceCost || 0 },
    { name: 'Other Expenses', value: (kpis?.operationalCost || 0) - (kpis?.fuelCost || 0) - (kpis?.maintenanceCost || 0) },
  ]

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="p-6 space-y-6">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.28em] text-cyan-500 dark:text-cyan-300">Analytics</div>
            <h1 className="text-3xl font-semibold mt-2">Reports</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Fleet performance, revenue, utilization, and operating cost visibility.</p>
          </div>
          <div>
            <button onClick={exportCsv} className="mr-2 px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-cyan-400 dark:text-slate-950 font-semibold">Export CSV</button>
            <button onClick={exportPdf} className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800">Export PDF</button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4">
          {[
            ['Active Vehicles', kpis?.activeVehicles],
            ['Available', kpis?.availableVehicles],
            ['Trips Today', kpis?.tripsToday],
            ['Pending Trips', kpis?.pendingTrips],
            ['Fuel Cost', kpis?.fuelCost],
            ['Operational Cost', kpis?.operationalCost],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow p-4">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-500">{label}</div>
              <div className="mt-2 text-2xl font-semibold">{value ?? 0}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <ChartCard title="Fuel Efficiency">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={reports.fuelEff}>
                <XAxis dataKey="vehicle" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="efficiency" fill="#06b6d4" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Trips Per Vehicle">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={reports.tripsPerVehicle}>
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="trips" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Trips Per Driver">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={reports.tripsPerDriver}>
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="trips" fill="#14b8a6" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Monthly Expenses">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={reports.monthlyExpenses}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id.month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total" stroke="#f59e0b" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Maintenance Trend">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={reports.maintenanceTrend}>
                <XAxis dataKey="_id.month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Expense Distribution">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieExpense} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80} paddingAngle={3}>
                  {pieExpense.map((entry, idx) => <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Fleet Utilization">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieFleet} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80} paddingAngle={3}>
                  {pieFleet.map((entry, idx) => <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Revenue vs Cost">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={revenueVsCost}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#0f172a" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Vehicle ROI">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={reports.vehicleRoi}>
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xl p-6">
          <h2 className="text-lg font-semibold mb-3">KPIs Snapshot</h2>
          <pre className="text-xs overflow-auto text-slate-600 dark:text-slate-300">{JSON.stringify(kpis, null, 2)}</pre>
        </div>
      </div>
    </div>
  )
}

function ChartCard({ title, children }){
  return (
    <div className="bg-white dark:bg-slate-900/80 rounded-3xl shadow-xl p-4 border border-slate-200 dark:border-slate-800">
      <h3 className="font-semibold mb-2">{title}</h3>
      {children}
    </div>
  )
}
