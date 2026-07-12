import { useEffect } from "react";
import { useForm } from "react-hook-form";
import api from "../../api/axios";

export default function DriverForm({
  initial = {},
  onSaved,
  onCancel,
}) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: initial,
  });

  useEffect(() => {
    reset(initial);
  }, [initial, reset]);

  const onSubmit = async (data) => {
    try {
      if (initial?._id) {
        await api.put(`/drivers/${initial._id}`, data);
      } else {
        await api.post("/drivers", data);
      }

      onSaved && onSaved();
    } catch (err) {
      alert(err.response?.data?.error || "Unable to save driver");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 md:grid-cols-2 gap-5"
    >
      <div>
        <label className="block mb-2 font-medium">
          Driver Name
        </label>

        <input
          {...register("name", { required: true })}
          className="input"
          placeholder="Alex Johnson"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          License Number
        </label>

        <input
          {...register("licenseNumber")}
          className="input"
          placeholder="DL12345678"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          License Category
        </label>

        <select
          {...register("licenseCategory")}
          className="input"
        >
          <option>LMV</option>
          <option>HMV</option>
          <option>Transport</option>
        </select>
      </div>

      <div>
        <label className="block mb-2 font-medium">
          License Expiry
        </label>

        <input
          type="date"
          {...register("licenseExpiryDate")}
          className="input"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Email
        </label>

        <input
          type="email"
          {...register("email")}
          className="input"
          placeholder="alex@email.com"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Contact Number
        </label>

        <input
          {...register("contactNumber")}
          className="input"
          placeholder="+91 9876543210"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Safety Score
        </label>

        <input
          type="number"
          {...register("safetyScore")}
          className="input"
          placeholder="95"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Status
        </label>

        <select
          {...register("status")}
          className="input"
        >
          <option>Available</option>
          <option>On Trip</option>
          <option>Off Duty</option>
          <option>Suspended</option>
        </select>
      </div>

      <div className="md:col-span-2 flex justify-end gap-3 mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 transition"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="btn-primary"
        >
          {initial?._id ? "Update Driver" : "Add Driver"}
        </button>
      </div>
    </form>
  );
}