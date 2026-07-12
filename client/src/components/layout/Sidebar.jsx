import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Sidebar(){
  return (
    <div className="w-64 bg-white h-screen shadow">
      <div className="p-4 font-bold text-lg">TransitOps</div>
      <nav className="p-4">
        <ul className="space-y-2">
          <li><NavLink to="/dashboard" className={({isActive})=>isActive? 'font-semibold':'text-sm'}>Dashboard</NavLink></li>
          <li><NavLink to="/vehicles" className={({isActive})=>isActive? 'font-semibold':'text-sm'}>Vehicles</NavLink></li>
          <li><NavLink to="/drivers" className={({isActive})=>isActive? 'font-semibold':'text-sm'}>Drivers</NavLink></li>
          <li><NavLink to="/trips" className={({isActive})=>isActive? 'font-semibold':'text-sm'}>Trips</NavLink></li>
          <li><NavLink to="/maintenance" className={({isActive})=>isActive? 'font-semibold':'text-sm'}>Maintenance</NavLink></li>
          <li><NavLink to="/fuel" className={({isActive})=>isActive? 'font-semibold':'text-sm'}>Fuel Logs</NavLink></li>
          <li><NavLink to="/expenses" className={({isActive})=>isActive? 'font-semibold':'text-sm'}>Expenses</NavLink></li>
          <li><NavLink to="/reports" className={({isActive})=>isActive? 'font-semibold':'text-sm'}>Reports</NavLink></li>
        </ul>
      </nav>
    </div>
  )
}
