import { useEffect, useState } from "react";
import api from "../../api/axios";
import DriverForm from "./DriverForm";
import {
  FiEdit2,
  FiPlus,
  FiSearch,
  FiTrash2,
} from "react-icons/fi";

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");

  const loadDrivers = async () => {
    try {
      const res = await api.get("/drivers", {
        params: { search },
      });

      setDrivers(res.data.items || res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadDrivers();
  }, [search]);

  const deleteDriver = async (id) => {
    if (!window.confirm("Delete this driver?")) return;

    try {
      await api.delete(`/drivers/${id}`);
      loadDrivers();
    } catch {
      alert("Unable to delete driver");
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            Driver Management
          </h1>

          <p className="text-slate-500">
            Manage drivers and licenses
          </p>
        </div>

        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <FiPlus />
          Add Driver
        </button>
      </div>

      {showForm && (
        <div className="card mb-6">
          <DriverForm
            initial={editing || {}}
            onSaved={() => {
              setShowForm(false);
              loadDrivers();
            }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      <div className="card">
        <div className="relative mb-5">
          <FiSearch className="absolute left-3 top-3 text-slate-400" />

          <input
            className="input pl-10"
            placeholder="Search driver..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">

            <thead>
              <tr className="border-b">
                <th className="text-left py-3">Name</th>
                <th className="text-left py-3">License</th>
                <th className="text-left py-3">Expiry</th>
                <th className="text-left py-3">Status</th>
                <th className="text-center py-3">Actions</th>
              </tr>
            </thead>

            <tbody>

              {drivers.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-10 text-slate-400"
                  >
                    No Drivers Found
                  </td>
                </tr>
              )}

              {drivers.map((driver) => (

                <tr
                  key={driver._id}
                  className="border-b hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >

                  <td className="py-4 font-medium">
                    {driver.name}
                  </td>

                  <td>{driver.licenseNumber}</td>

                  <td>
                    {driver.licenseExpiryDate
                      ? new Date(
                          driver.licenseExpiryDate
                        ).toLocaleDateString()
                      : "-"}
                  </td>

                  <td>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        driver.status === "Available"
                          ? "bg-green-100 text-green-700"
                          : driver.status === "On Trip"
                          ? "bg-blue-100 text-blue-700"
                          : driver.status === "Off Duty"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {driver.status}
                    </span>

                  </td>

                  <td>

                    <div className="flex justify-center gap-2">

                      <button
                        onClick={() => {
                          setEditing(driver);
                          setShowForm(true);
                        }}
                        className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200"
                      >
                        <FiEdit2 />
                      </button>

                      <button
                        onClick={() =>
                          deleteDriver(driver._id)
                        }
                        className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                      >
                        <FiTrash2 />
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}