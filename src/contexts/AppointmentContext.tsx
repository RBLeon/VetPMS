import React, { createContext, useContext } from "react";
import { Appointment } from "../types/appointment";

interface AppointmentContextType {
  createAppointment: (appointment: Partial<Appointment>) => Promise<void>;
  updateAppointment: (
    id: string,
    appointment: Partial<Appointment>
  ) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(
  undefined
);

export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error(
      "useAppointments must be used within an AppointmentProvider"
    );
  }
  return context;
};

interface AppointmentProviderProps {
  children: React.ReactNode;
}

export const AppointmentProvider: React.FC<AppointmentProviderProps> = ({
  children,
}) => {
  const createAppointment = async (appointment: Partial<Appointment>) => {
    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointment),
      });

      if (!response.ok) {
        throw new Error("Failed to create appointment");
      }
    } catch (error) {
      console.error("Error creating appointment:", error);
      throw error;
    }
  };

  const updateAppointment = async (
    id: string,
    appointment: Partial<Appointment>
  ) => {
    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointment),
      });

      if (!response.ok) {
        throw new Error("Failed to update appointment");
      }
    } catch (error) {
      console.error("Error updating appointment:", error);
      throw error;
    }
  };

  const deleteAppointment = async (id: string) => {
    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete appointment");
      }
    } catch (error) {
      console.error("Error deleting appointment:", error);
      throw error;
    }
  };

  return (
    <AppointmentContext.Provider
      value={{
        createAppointment,
        updateAppointment,
        deleteAppointment,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};
