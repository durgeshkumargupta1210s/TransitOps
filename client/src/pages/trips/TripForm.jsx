import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import api from "../../api/axios";

export default function TripForm({
  initial = {},
  onSaved,
  onCancel,
}) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: initial,
  });

  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    reset(initial);

    api.get("/vehicles").then((res) => {
      setVehicles(res.data.items || res.data);
    });

    api.get("/drivers").then((res) => {
      setDrivers(res.data.items || res.data);
    });
  }, [initial, reset]);

  const onSubmit = async (data) => {
    try {
      if (initial?._id) {
        await api.put(`/trips/${initial._id}`, data);
      } else {
        await api.post("/trips", data);
      }

      onSaved();
    } catch (err) {
      alert(err.response?.data?.error || "Unable to save trip");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 md:grid-cols-2 gap-5"
    >
      <div>
        <label className="block mb-2 font-medium">
          Vehicle
        </label>

        <select {...register("vehicle")} className="input">
          <option value="">Select Vehicle</option>

          {vehicles.map((v) => (
            <option key={v._id} value={v._id}>
              {v.registrationNumber}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Driver
        </label>

        <select {...register("driver")} className="input">
          <option value="">Select Driver</option>

          {drivers.map((d) => (
            <option key={d._id} value={d._id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Source
        </label>

        <input
          {...register("source")}
          className="input"
          placeholder="Delhi"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Destination
        </label>

        <input
          {...register("destination")}
          className="input"
          placeholder="Mumbai"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Cargo Weight (Kg)
        </label>

        <input
          type="number"
          {...register("cargoWeight")}
          className="input"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Planned Distance (Km)
        </label>

        <input
          type="number"
          {...register("plannedDistance")}
          className="input"
        />
      </div>

      <div className="md:col-span-2">
        <label className="block mb-2 font-medium">
          Revenue
        </label>

        <input
          type="number"
          {...register("revenue")}
          className="input"
        />
      </div>

      <div className="md:col-span-2 flex justify-end gap-3 mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300"
        >
          Cancel
        </button>

        <button className="btn-primary">
          {initial?._id ? "Update Trip" : "Create Trip"}
        </button>
      </div>
    </form>
  );
}