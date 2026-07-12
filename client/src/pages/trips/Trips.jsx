import { useEffect, useState } from "react";
import api from "../../api/axios";
import TripForm from "./TripForm";
import {
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";

export default function Trips() {
  const [trips, setTrips] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");

  const loadTrips = async () => {
    try {
      const res = await api.get("/trips", {
        params: { search },
      });

      setTrips(res.data.items || res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadTrips();
  }, [search]);

  const dispatchTrip = async (id) => {
    try {
      await api.post(`/trips/${id}/dispatch`);
      loadTrips();
    } catch (err) {
      alert(err.response?.data?.error || "Dispatch failed");
    }
  };

  const completeTrip = async (id) => {
    try {
      await api.post(`/trips/${id}/complete`, {});
      loadTrips();
    } catch (err) {
      alert(err.response?.data?.error || "Complete failed");
    }
  };

  const cancelTrip = async (id) => {
    try {
      await api.post(`/trips/${id}/cancel`);
      loadTrips();
    } catch (err) {
      alert(err.response?.data?.error || "Cancel failed");
    }
  };

  return (
    <div>

      <div className="flex justify-between items-center mb-6">

        <div>
          <h1 className="text-3xl font-bold">
            Trip Management
          </h1>

          <p className="text-slate-500">
            Manage fleet trips
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
          New Trip
        </button>

      </div>

      {showForm && (
        <div className="card mb-6">

          <TripForm
            initial={editing || {}}
            onSaved={() => {
              setShowForm(false);
              loadTrips();
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
            placeholder="Search Trip..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

        <div className="overflow-x-auto">

          <table className="min-w-full">

            <thead>

              <tr className="border-b">

                <th className="text-left py-3">Vehicle</th>
                <th className="text-left py-3">Driver</th>
                <th className="text-left py-3">Route</th>
                <th className="text-left py-3">Cargo</th>
                <th className="text-left py-3">Status</th>
                <th className="text-center py-3">Actions</th>

              </tr>

            </thead>

            <tbody>

              {trips.length === 0 && (
                <tr>

                  <td
                    colSpan={6}
                    className="text-center py-10 text-slate-400"
                  >
                    No Trips Found
                  </td>

                </tr>
              )}

              {trips.map((trip) => (

                <tr
                  key={trip._id}
                  className="border-b hover:bg-slate-50 dark:hover:bg-slate-800"
                >

                  <td>{trip.vehicle?.registrationNumber}</td>

                  <td>{trip.driver?.name}</td>

                  <td>
                    {trip.source} → {trip.destination}
                  </td>

                  <td>{trip.cargoWeight} Kg</td>

                  <td>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        trip.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : trip.status === "Dispatched"
                          ? "bg-blue-100 text-blue-700"
                          : trip.status === "Cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {trip.status}
                    </span>

                  </td>

                  <td>

                    <div className="flex gap-2 justify-center">

                      {trip.status === "Draft" && (
                        <button
                          onClick={() => dispatchTrip(trip._id)}
                          className="p-2 rounded-lg bg-green-100 text-green-700"
                          title="Dispatch"
                        >
                          <FiTruck />
                        </button>
                      )}

                      {trip.status === "Dispatched" && (
                        <button
                          onClick={() => completeTrip(trip._id)}
                          className="p-2 rounded-lg bg-blue-100 text-blue-700"
                          title="Complete"
                        >
                          <FiCheckCircle />
                        </button>
                      )}

                      {trip.status !== "Completed" &&
                        trip.status !== "Cancelled" && (
                          <button
                            onClick={() => cancelTrip(trip._id)}
                            className="p-2 rounded-lg bg-red-100 text-red-700"
                            title="Cancel"
                          >
                            <FiXCircle />
                          </button>
                        )}

                      <button
                        onClick={() => {
                          setEditing(trip);
                          setShowForm(true);
                        }}
                        className="p-2 rounded-lg bg-blue-100 text-blue-700"
                      >
                        <FiEdit2 />
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