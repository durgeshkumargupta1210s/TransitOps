import React, { useEffect, useState } from "react";
import api from "../api/axios";
import socket, { connect, disconnect } from "../api/socket";
import {
  FiTruck,
  FiMap,
  FiUsers,
  FiDollarSign,
  FiActivity,
  FiTool,
  FiDroplet,
  FiClock,
} from "react-icons/fi";

export default function Dashboard() {
  const [kpis, setKpis] = useState({});
  const [recentLogins, setRecentLogins] = useState([]);
  const [presence, setPresence] = useState([]);

  useEffect(() => {
    api
      .get("/reports/kpis")
      .then((res) => setKpis(res.data))
      .catch(console.error);

    api
      .get("/presence")
      .then((res) => setPresence(res.data.online))
      .catch(console.error);

    connect();

    socket.on("user:login", (user) => {
      setRecentLogins((prev) => [user, ...prev].slice(0, 10));
    });

    socket.on("presence:update", (users) => {
      setPresence(users);
    });

    return () => {
      socket.off("user:login");
      socket.off("presence:update");
      disconnect();
    };
  }, []);

  const cards = [
    {
      title: "Active Vehicles",
      value: kpis.activeVehicles || 0,
      icon: <FiTruck size={24} />,
      color: "text-cyan-600",
    },
    {
      title: "Available Vehicles",
      value: kpis.availableVehicles || 0,
      icon: <FiActivity size={24} />,
      color: "text-green-600",
    },
    {
      title: "Trips Today",
      value: kpis.tripsToday || 0,
      icon: <FiMap size={24} />,
      color: "text-orange-500",
    },
    {
      title: "Drivers On Duty",
      value: kpis.driversOnDuty || 0,
      icon: <FiUsers size={24} />,
      color: "text-indigo-600",
    },
    {
      title: "Fuel Cost",
      value: `₹${kpis.fuelCost || 0}`,
      icon: <FiDroplet size={24} />,
      color: "text-red-500",
    },
    {
      title: "Maintenance Cost",
      value: `₹${kpis.maintenanceCost || 0}`,
      icon: <FiTool size={24} />,
      color: "text-yellow-500",
    },
    {
      title: "Pending Trips",
      value: kpis.pendingTrips || 0,
      icon: <FiClock size={24} />,
      color: "text-purple-600",
    },
    {
      title: "Revenue",
      value: `₹${kpis.revenue || 0}`,
      icon: <FiDollarSign size={24} />,
      color: "text-emerald-600",
    },
  ];

  return (
    <div className="p-6 bg-slate-100 dark:bg-slate-950 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-slate-800 dark:text-white">
        Dashboard
      </h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white dark:bg-slate-900 rounded-xl shadow-md p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm">{card.title}</p>
                <h2 className={`text-3xl font-bold mt-2 ${card.color}`}>
                  {card.value}
                </h2>
              </div>

              <div
                className={`w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center ${card.color}`}
              >
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="grid lg:grid-cols-2 gap-6 mt-8">
        {/* Recent Logins */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md p-5">
          <h2 className="text-xl font-semibold mb-4">
            Recent Sign-ins
          </h2>

          {recentLogins.length === 0 ? (
            <p className="text-slate-500">No recent sign-ins</p>
          ) : (
            recentLogins.map((user, i) => (
              <div
                key={i}
                className="flex justify-between items-center py-3 border-b last:border-none"
              >
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-slate-500">
                    {user.email}
                  </p>
                </div>

                <span className="text-xs text-slate-400">
                  {new Date(user.at).toLocaleTimeString()}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Online Users */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md p-5">
          <h2 className="text-xl font-semibold mb-4">
            Online Users ({presence.length})
          </h2>

          {presence.length === 0 ? (
            <p className="text-slate-500">No users online</p>
          ) : (
            presence.map((user) => (
              <div
                key={user.socketId}
                className="flex justify-between items-center py-3 border-b last:border-none"
              >
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-slate-500">
                    {user.role}
                  </p>
                </div>

                <span className="w-3 h-3 rounded-full bg-green-500"></span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}