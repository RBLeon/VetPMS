import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useAppointments } from "../contexts/AppointmentContext";
import { Appointment, AppointmentStatus } from "../types/appointment";
import { Pet } from "../types/pet";
import { User } from "../types/user";
import { format } from "date-fns";

interface AppointmentFormProps {
  appointment?: Appointment;
  isEditing?: boolean;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  appointment,
  isEditing = false,
}) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { createAppointment, updateAppointment } = useAppointments();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [vets, setVets] = useState<User[]>([]);

  const [formData, setFormData] = useState<Partial<Appointment>>({
    petId: "",
    vetId: "",
    date: format(new Date(), "yyyy-MM-dd"),
    time: format(new Date(), "HH:mm"),
    type: "",
    notes: "",
    status: AppointmentStatus.SCHEDULED,
    ...appointment,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch pets and vets data here
        // This is a placeholder - implement actual API calls
        const petsResponse = await fetch("/api/pets");
        const vetsResponse = await fetch("/api/vets");
        const petsData = await petsResponse.json();
        const vetsData = await vetsResponse.json();

        setPets(petsData);
        setVets(vetsData);
      } catch (err) {
        setError("Failed to load form data");
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!currentUser) {
        throw new Error("User not authenticated");
      }

      const appointmentData: Partial<Appointment> = {
        ...formData,
        userId: currentUser.id,
      };

      if (isEditing && appointment) {
        await updateAppointment(appointment.id, appointmentData);
      } else {
        await createAppointment(appointmentData);
      }

      navigate("/appointments");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="petId"
          className="block text-sm font-medium text-gray-700"
        >
          Pet
        </label>
        <select
          id="petId"
          name="petId"
          value={formData.petId}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Select a pet</option>
          {pets.map((pet) => (
            <option key={pet.id} value={pet.id}>
              {pet.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="vetId"
          className="block text-sm font-medium text-gray-700"
        >
          Veterinarian
        </label>
        <select
          id="vetId"
          name="vetId"
          value={formData.vetId}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Select a veterinarian</option>
          {vets.map((vet) => (
            <option key={vet.id} value={vet.id}>
              {vet.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="date"
          className="block text-sm font-medium text-gray-700"
        >
          Date
        </label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label
          htmlFor="time"
          className="block text-sm font-medium text-gray-700"
        >
          Time
        </label>
        <input
          type="time"
          id="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label
          htmlFor="type"
          className="block text-sm font-medium text-gray-700"
        >
          Appointment Type
        </label>
        <input
          type="text"
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-gray-700"
        >
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label
          htmlFor="status"
          className="block text-sm font-medium text-gray-700"
        >
          Status
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          {Object.values(AppointmentStatus).map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => navigate("/appointments")}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isEditing ? "Update Appointment" : "Create Appointment"}
        </button>
      </div>
    </form>
  );
};

export default AppointmentForm;
