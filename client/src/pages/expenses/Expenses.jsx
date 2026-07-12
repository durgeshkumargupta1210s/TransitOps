import { useEffect, useState } from "react";
import api from "../../api/axios";
import { FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";

export default function Expenses() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    vehicle: "",
    type: "",
    amount: "",
    date: "",
  });

  const load = async () => {
    try {
      const res = await api.get("/expenses", {
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
      await api.post("/expenses", form);

      setForm({
        vehicle: "",
        type: "",
        amount: "",
        date: "",
      });

      load();
    } catch (err) {
      alert(err.response?.data?.error || "Unable to add expense");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete Expense?")) return;

    await api.delete(`/expenses/${id}`);
    load();
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Expenses</h1>
        <p className="text-slate-500">
          Track operational expenses
        </p>
      </div>

      <div className="card mb-6">
        <h2 className="font-semibold mb-4">
          Add Expense
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            className="input"
            placeholder="Vehicle ID"
            value={form.vehicle}
            onChange={(e) =>
              setForm({ ...form, vehicle: e.target.value })
            }
          />

          <input
            className="input"
            placeholder="Expense Type"
            value={form.type}
            onChange={(e) =>
              setForm({ ...form, type: e.target.value })
            }
          />

          <input
            className="input"
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) =>
              setForm({ ...form, amount: e.target.value })
            }
          />

          <input
            className="input"
            type="date"
            value={form.date}
            onChange={(e) =>
              setForm({ ...form, date: e.target.value })
            }
          />
        </div>

        <button
          onClick={save}
          className="btn-primary mt-5 flex items-center gap-2"
        >
          <FiPlus />
          Add Expense
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
                <th className="text-left py-3">Vehicle</th>
                <th className="text-left">Type</th>
                <th className="text-left">Amount</th>
                <th className="text-left">Date</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {items.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-10 text-slate-400"
                  >
                    No Expenses Found
                  </td>
                </tr>
              )}

              {items.map((expense) => (
                <tr
                  key={expense._id}
                  className="border-b hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <td>
                    {expense.vehicle?.registrationNumber ||
                      expense.vehicle}
                  </td>

                  <td>{expense.type}</td>

                  <td className="font-semibold text-red-600">
                    ₹ {expense.amount}
                  </td>

                  <td>
                    {new Date(expense.date).toLocaleDateString()}
                  </td>

                  <td>
                    <div className="flex justify-center">
                      <button
                        onClick={() => remove(expense._id)}
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