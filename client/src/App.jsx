import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Vehicles from './pages/vehicles/Vehicles'
import Drivers from './pages/drivers/Drivers'
import Trips from './pages/trips/Trips'
import Maintenance from './pages/maintenance/Maintenance'
import FuelLogs from './pages/fuel/FuelLogs'
import Expenses from './pages/expenses/Expenses'
import Reports from './pages/reports/Reports'
import { useContext } from 'react'
import { AuthContext } from './context/AuthContext'

function Protected({ children }){
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" />;
  return children;
}

export default function App(){
  return (
    <Routes>
      <Route path="/login" element={<Login/>} />
      <Route path="/dashboard" element={<Protected><Dashboard/></Protected>} />
      <Route path="/vehicles" element={<Protected><Vehicles/></Protected>} />
      <Route path="/drivers" element={<Protected><Drivers/></Protected>} />
      <Route path="/trips" element={<Protected><Trips/></Protected>} />
      <Route path="/maintenance" element={<Protected><Maintenance/></Protected>} />
      <Route path="/fuel" element={<Protected><FuelLogs/></Protected>} />
      <Route path="/expenses" element={<Protected><Expenses/></Protected>} />
      <Route path="/reports" element={<Protected><Reports/></Protected>} />
      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  )
}
