import { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  FiPlus,
  FiSearch,
  FiTool,
  FiCheckCircle,
  FiTrash2,
} from "react-icons/fi";

export default function Maintenance() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    vehicle: "",
    maintenanceType: "",
    description: "",
    cost: "",
  });

  const load = async () => {
    try {
      const res = await api.get("/maintenance", {
        params: { search },
      });

      setItems(res.data.items || res.data);
    } catch {}
  };

  useEffect(() => {
    load();
  }, [search]);

  const save = async () => {
    try {
      await api.post("/maintenance", form);

      setForm({
        vehicle: "",
        maintenanceType: "",
        description: "",
        cost: "",
      });

      load();
    } catch (err) {
      alert(err.response?.data?.error || "Unable to create maintenance");
    }
  };

  const closeMaintenance = async (id) => {
    await api.post(`/maintenance/${id}/close`);
    load();
  };

  const removeMaintenance = async (id) => {
    if (!window.confirm("Delete Maintenance?")) return;

    await api.delete(`/maintenance/${id}`);

    load();
  };

  return (
    <div>

      <div className="flex justify-between items-center mb-6">

        <div>
          <h1 className="text-3xl font-bold">
            Maintenance
          </h1>

          <p className="text-slate-500">
            Vehicle service management
          </p>
        </div>

      </div>

      <div className="card mb-6">

        <h2 className="font-semibold mb-4">
          Create Maintenance
        </h2>

        <div className="grid md:grid-cols-2 gap-4">

          <input
            className="input"
            placeholder="Vehicle ID"
            value={form.vehicle}
            onChange={(e) =>
              setForm({
                ...form,
                vehicle: e.target.value,
              })
            }
          />

          <input
            className="input"
            placeholder="Maintenance Type"
            value={form.maintenanceType}
            onChange={(e) =>
              setForm({
                ...form,
                maintenanceType: e.target.value,
              })
            }
          />

          <input
            className="input"
            placeholder="Cost"
            type="number"
            value={form.cost}
            onChange={(e) =>
              setForm({
                ...form,
                cost: e.target.value,
              })
            }
          />

          <textarea
            className="input"
            rows={3}
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
          />

        </div>

        <button
          onClick={save}
          className="btn-primary mt-5 flex items-center gap-2"
        >
          <FiPlus />
          Create Maintenance
        </button>

      </div>

      <div className="card">

        <div className="relative mb-5">

          <FiSearch className="absolute left-3 top-3 text-slate-400" />

          <input
            className="input pl-10"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

        <div className="overflow-x-auto">

          <table className="min-w-full">

            <thead>

              <tr className="border-b">

                <th className="py-3 text-left">
                  Vehicle
                </th>

                <th className="text-left">
                  Type
                </th>

                <th className="text-left">
                  Cost
                </th>

                <th className="text-left">
                  Status
                </th>

                <th className="text-center">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {items.length === 0 && (
                <tr>

                  <td
                    colSpan={5}
                    className="text-center py-10 text-slate-400"
                  >
                    No Maintenance Records
                  </td>

                </tr>
              )}

              {items.map((m) => (

                <tr
                  key={m._id}
                  className="border-b hover:bg-slate-50 dark:hover:bg-slate-800"
                >

                  <td>
                    {m.vehicle?.registrationNumber ||
                      m.vehicle}
                  </td>

                  <td>{m.maintenanceType}</td>

                  <td>₹ {m.cost}</td>

                  <td>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        m.status === "Open"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {m.status}
                    </span>

                  </td>

                  <td>

                    <div className="flex justify-center gap-2">

                      {m.status === "Open" && (
                        <button
                          onClick={() =>
                            closeMaintenance(m._id)
                          }
                          className="p-2 rounded-lg bg-green-100 text-green-700"
                        >
                          <FiCheckCircle />
                        </button>
                      )}

                      <button
                        onClick={() =>
                          removeMaintenance(m._id)
                        }
                        className="p-2 rounded-lg bg-red-100 text-red-700"
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