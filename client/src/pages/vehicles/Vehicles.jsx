import { useEffect, useState } from "react";
import api from "../../api/axios";
import VehicleForm from "./VehicleForm";
import { FiEdit2, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const [search, setSearch] = useState("");

  const loadVehicles = async () => {
    try {
      const res = await api.get("/vehicles", {
        params: { search },
      });

      setVehicles(res.data.items || res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, [search]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this vehicle?")) return;

    try {
      await api.delete(`/vehicles/${id}`);
      loadVehicles();
    } catch (err) {
      alert("Unable to delete vehicle");
    }
  };

  return (
    <div>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">

        <div>
          <h1 className="text-3xl font-bold">
            Vehicle Management
          </h1>

          <p className="text-slate-500">
            Manage all fleet vehicles
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
          Add Vehicle
        </button>

      </div>

      {showForm && (
        <div className="card mb-6">

          <VehicleForm
            initial={editing || {}}
            onSaved={() => {
              setShowForm(false);
              loadVehicles();
            }}
            onCancel={() => setShowForm(false)}
          />

        </div>
      )}

      <div className="card">

        <div className="mb-5 relative">

          <FiSearch className="absolute left-4 top-3 text-slate-400" />

          <input
            type="text"
            placeholder="Search vehicle..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10"
          />

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b">

                <th className="text-left py-3">Registration</th>
                <th className="text-left py-3">Model</th>
                <th className="text-left py-3">Type</th>
                <th className="text-left py-3">Capacity</th>
                <th className="text-left py-3">Status</th>
                <th className="text-center py-3">Actions</th>

              </tr>

            </thead>

            <tbody>

              {vehicles.length === 0 && (
                <tr>

                  <td
                    colSpan={6}
                    className="text-center py-10 text-slate-400"
                  >
                    No vehicles found
                  </td>

                </tr>
              )}

              {vehicles.map((vehicle) => (

                <tr
                  key={vehicle._id}
                  className="border-b hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >

                  <td className="py-4 font-medium">
                    {vehicle.registrationNumber}
                  </td>

                  <td>{vehicle.vehicleModel}</td>

                  <td>{vehicle.vehicleType}</td>

                  <td>{vehicle.maximumLoadCapacity} kg</td>

                  <td>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold
                      ${
                        vehicle.status === "Available"
                          ? "bg-green-100 text-green-700"
                          : vehicle.status === "On Trip"
                          ? "bg-blue-100 text-blue-700"
                          : vehicle.status === "In Shop"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {vehicle.status}
                    </span>

                  </td>

                  <td>

                    <div className="flex justify-center gap-2">

                      <button
                        onClick={() => {
                          setEditing(vehicle);
                          setShowForm(true);
                        }}
                        className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600"
                      >
                        <FiEdit2 />
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(vehicle._id)
                        }
                        className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600"
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