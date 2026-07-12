import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiTruck,
  FiUsers,
  FiMap,
  FiTool,
  FiDroplet,
  FiDollarSign,
  FiBarChart2,
  FiSettings,
  FiUser,
  FiActivity,
} from "react-icons/fi";

const menu = [
  { name: "Dashboard", icon: FiHome, path: "/dashboard" },
  { name: "Vehicles", icon: FiTruck, path: "/vehicles" },
  { name: "Drivers", icon: FiUsers, path: "/drivers" },
  { name: "Trips", icon: FiMap, path: "/trips" },
  { name: "Maintenance", icon: FiTool, path: "/maintenance" },
  { name: "Fuel Logs", icon: FiDroplet, path: "/fuel" },
  { name: "Expenses", icon: FiDollarSign, path: "/expenses" },
  { name: "Reports", icon: FiBarChart2, path: "/reports" },
  { name: "Users", icon: FiUsers, path: "/users" },
  { name: "Profile", icon: FiUser, path: "/profile" },
  { name: "Settings", icon: FiSettings, path: "/settings" },
];

export default function Sidebar() {
  return (
    <aside className="w-72 h-screen sticky top-0 bg-slate-950 text-white flex flex-col border-r border-slate-800">

      <div className="px-6 py-8 border-b border-slate-800">

        <div className="flex items-center gap-3">

          <div className="w-12 h-12 rounded-xl bg-cyan-600 flex items-center justify-center">
            <FiActivity size={24} />
          </div>

          <div>
            <h2 className="text-2xl font-bold">
              TransitOps
            </h2>

            <p className="text-xs text-slate-400">
              Smart Fleet Platform
            </p>
          </div>

        </div>

      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-6">

        <ul className="space-y-2">

          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <li key={item.path}>

                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-cyan-600 text-white shadow-lg"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`
                  }
                >
                  <Icon size={20} />

                  <span className="font-medium">
                    {item.name}
                  </span>

                </NavLink>

              </li>
            );
          })}

        </ul>

      </nav>

      <div className="border-t border-slate-800 p-5">

        <div className="rounded-xl bg-slate-900 p-4">

          <p className="text-xs uppercase tracking-wider text-slate-500">
            Version
          </p>

          <h3 className="mt-1 font-semibold">
            TransitOps v1.0
          </h3>

          <p className="text-xs text-slate-500 mt-2">
            LG Soft Hackathon Edition
          </p>

        </div>

      </div>

    </aside>
  );
}