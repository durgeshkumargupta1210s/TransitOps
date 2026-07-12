import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import api from "../../api/axios";

export default function VehicleForm({
  initial = {},
  onSaved,
  onCancel,
}) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      registrationNumber: "",
      vehicleModel: "",
      vehicleType: "",
      maximumLoadCapacity: 0,
      odometer: 0,
      acquisitionCost: 0,
      status: "Available",
      ...initial,
    },
  });

  useEffect(() => {
    reset({
      registrationNumber: "",
      vehicleModel: "",
      vehicleType: "",
      maximumLoadCapacity: 0,
      odometer: 0,
      acquisitionCost: 0,
      status: "Available",
      ...initial,
    });
  }, [initial, reset]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        registrationNumber: data.registrationNumber.trim(),
        vehicleModel: data.vehicleModel.trim(),
        vehicleType: data.vehicleType.trim(),
        maximumLoadCapacity: Number(data.maximumLoadCapacity),
        odometer: Number(data.odometer),
        acquisitionCost: Number(data.acquisitionCost),
        status: data.status,
      };

      if (initial._id) {
        await api.put(`/vehicles/${initial._id}`, payload);
      } else {
        await api.post("/vehicles", payload);
      }

      onSaved && onSaved();
    } catch (err) {
      alert(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Save failed"
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <input
        {...register("registrationNumber", { required: true })}
        placeholder="Registration Number"
        className="input"
      />

      <input
        {...register("vehicleModel")}
        placeholder="Vehicle Model"
        className="input"
      />

      <input
        {...register("vehicleType")}
        placeholder="Vehicle Type"
        className="input"
      />

      <input
        {...register("maximumLoadCapacity", {
          valueAsNumber: true,
        })}
        type="number"
        placeholder="Maximum Load Capacity"
        className="input"
      />

      <input
        {...register("odometer", {
          valueAsNumber: true,
        })}
        type="number"
        placeholder="Odometer Reading"
        className="input"
      />

      <input
        {...register("acquisitionCost", {
          valueAsNumber: true,
        })}
        type="number"
        placeholder="Acquisition Cost"
        className="input"
      />

      <select
        {...register("status")}
        className="input"
      >
        <option value="Available">Available</option>
        <option value="On Trip">On Trip</option>
        <option value="In Shop">In Shop</option>
        <option value="Retired">Retired</option>
      </select>

      <div className="md:col-span-2 flex gap-3 mt-2">
        <button
          type="submit"
          className="btn-primary"
        >
          {initial._id ? "Update Vehicle" : "Add Vehicle"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}