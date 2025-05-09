import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@/test/test-utils";
import userEvent from "@testing-library/user-event";
import { AppointmentForm } from "../AppointmentForm";
import { Route, Routes, MemoryRouter } from "react-router-dom";

// Mock the hooks
vi.mock("@/lib/hooks/useApi", () => ({
  useAppointment: vi.fn(() => ({
    data: {
      id: "1",
      patientId: "1",
      clientId: "1",
      date: "2024-03-15",
      time: "09:00",
      type: "Check-up",
      status: "scheduled",
      notes: "Regular check-up",
      isRecurring: true,
      recurringPattern: {
        frequency: "weekly",
        interval: 1,
        endDate: "2024-04-15",
      },
      reminder: {
        type: "email",
        time: "24h",
      },
    },
    isLoading: false,
  })),
  usePatients: vi.fn(() => ({
    data: [
      { id: "1", name: "Max" },
      { id: "2", name: "Bella" },
    ],
  })),
  useClients: vi.fn(() => ({
    data: [
      { id: "1", name: "John Smith" },
      { id: "2", name: "Emma Johnson" },
    ],
  })),
  useCreateAppointment: vi.fn(() => ({
    mutateAsync: vi.fn(),
    isPending: false,
  })),
  useUpdateAppointment: vi.fn(() => ({
    mutateAsync: vi.fn(),
    isPending: false,
  })),
}));

describe("AppointmentForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the form with appointment information", async () => {
    render(
      <MemoryRouter initialEntries={["/calendar/new"]}>
        <Routes>
          <Route path="/calendar/new" element={<AppointmentForm />} />
          <Route path="/calendar/:id/edit" element={<AppointmentForm />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Schedule Appointment")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Check-up")).toBeInTheDocument();
      expect(screen.getByDisplayValue("09:00")).toBeInTheDocument();
    });
  });

  it("validates required fields", async () => {
    render(
      <MemoryRouter initialEntries={["/calendar/new"]}>
        <Routes>
          <Route path="/calendar/new" element={<AppointmentForm />} />
          <Route path="/calendar/:id/edit" element={<AppointmentForm />} />
        </Routes>
      </MemoryRouter>
    );

    const submitButton = screen.getByText("Schedule Appointment");
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Client is required")).toBeInTheDocument();
      expect(screen.getByText("Patient is required")).toBeInTheDocument();
      expect(screen.getByText("Date is required")).toBeInTheDocument();
      expect(screen.getByText("Time is required")).toBeInTheDocument();
      expect(screen.getByText("Type is required")).toBeInTheDocument();
    });
  });

  it("handles recurring appointment setup", async () => {
    render(
      <MemoryRouter initialEntries={["/calendar/new"]}>
        <Routes>
          <Route path="/calendar/new" element={<AppointmentForm />} />
          <Route path="/calendar/:id/edit" element={<AppointmentForm />} />
        </Routes>
      </MemoryRouter>
    );

    // Enable recurring appointment
    const recurringSwitch = screen.getByLabelText("Recurring Appointment");
    await userEvent.click(recurringSwitch);

    // Set recurring pattern
    const frequencySelect = screen.getByLabelText("Frequency");
    await userEvent.selectOptions(frequencySelect, "weekly");

    const intervalInput = screen.getByLabelText("Interval");
    await userEvent.type(intervalInput, "2");

    const endDateInput = screen.getByLabelText("End Date");
    await userEvent.type(endDateInput, "2024-04-15");

    await waitFor(() => {
      expect(frequencySelect).toHaveValue("weekly");
      expect(intervalInput).toHaveValue(2);
      expect(endDateInput).toHaveValue("2024-04-15");
    });
  });

  it("handles reminder setup", async () => {
    render(
      <MemoryRouter initialEntries={["/calendar/new"]}>
        <Routes>
          <Route path="/calendar/new" element={<AppointmentForm />} />
          <Route path="/calendar/:id/edit" element={<AppointmentForm />} />
        </Routes>
      </MemoryRouter>
    );

    // Enable reminder
    const reminderSwitch = screen.getByLabelText("Set Reminder");
    await userEvent.click(reminderSwitch);

    // Set reminder type
    const typeSelect = screen.getByLabelText("Reminder Type");
    await userEvent.selectOptions(typeSelect, "email");

    // Set reminder time
    const timeSelect = screen.getByLabelText("Reminder Time");
    await userEvent.selectOptions(timeSelect, "24h");

    await waitFor(() => {
      expect(typeSelect).toHaveValue("email");
      expect(timeSelect).toHaveValue("24h");
    });
  });

  it("loads existing recurring appointment data", async () => {
    render(
      <MemoryRouter initialEntries={["/calendar/1/edit"]}>
        <Routes>
          <Route path="/calendar/new" element={<AppointmentForm />} />
          <Route path="/calendar/:id/edit" element={<AppointmentForm />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Recurring Appointment")).toBeChecked();
      expect(screen.getByLabelText("Frequency")).toHaveValue("weekly");
      expect(screen.getByLabelText("Interval")).toHaveValue(1);
      expect(screen.getByLabelText("End Date")).toHaveValue("2024-04-15");
    });
  });

  it("loads existing reminder data", async () => {
    render(
      <MemoryRouter initialEntries={["/calendar/1/edit"]}>
        <Routes>
          <Route path="/calendar/new" element={<AppointmentForm />} />
          <Route path="/calendar/:id/edit" element={<AppointmentForm />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Set Reminder")).toBeChecked();
      expect(screen.getByLabelText("Reminder Type")).toHaveValue("email");
      expect(screen.getByLabelText("Reminder Time")).toHaveValue("24h");
    });
  });

  it("handles form submission with recurring pattern", async () => {
    const { useCreateAppointment } = await import("@/lib/hooks/useApi");
    const mockMutateAsync = vi.fn();
    (useCreateAppointment as any).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    });

    render(
      <MemoryRouter initialEntries={["/calendar/new"]}>
        <Routes>
          <Route path="/calendar/new" element={<AppointmentForm />} />
          <Route path="/calendar/:id/edit" element={<AppointmentForm />} />
        </Routes>
      </MemoryRouter>
    );

    // Fill required fields
    await userEvent.selectOptions(screen.getByLabelText("Client"), "1");
    await userEvent.selectOptions(screen.getByLabelText("Patient"), "1");
    await userEvent.type(screen.getByLabelText("Date"), "2024-03-15");
    await userEvent.type(screen.getByLabelText("Time"), "09:00");
    await userEvent.selectOptions(screen.getByLabelText("Type"), "Check-up");

    // Enable and configure recurring pattern
    await userEvent.click(screen.getByLabelText("Recurring Appointment"));
    await userEvent.selectOptions(screen.getByLabelText("Frequency"), "weekly");
    await userEvent.type(screen.getByLabelText("Interval"), "2");
    await userEvent.type(screen.getByLabelText("End Date"), "2024-04-15");

    const submitButton = screen.getByText("Schedule Appointment");
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          isRecurring: true,
          recurringPattern: {
            frequency: "weekly",
            interval: 2,
            endDate: "2024-04-15",
          },
        })
      );
    });
  });

  it("handles form submission with reminder", async () => {
    const { useCreateAppointment } = await import("@/lib/hooks/useApi");
    const mockMutateAsync = vi.fn();
    (useCreateAppointment as any).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    });

    render(
      <MemoryRouter initialEntries={["/calendar/new"]}>
        <Routes>
          <Route path="/calendar/new" element={<AppointmentForm />} />
          <Route path="/calendar/:id/edit" element={<AppointmentForm />} />
        </Routes>
      </MemoryRouter>
    );

    // Fill required fields
    await userEvent.selectOptions(screen.getByLabelText("Client"), "1");
    await userEvent.selectOptions(screen.getByLabelText("Patient"), "1");
    await userEvent.type(screen.getByLabelText("Date"), "2024-03-15");
    await userEvent.type(screen.getByLabelText("Time"), "09:00");
    await userEvent.selectOptions(screen.getByLabelText("Type"), "Check-up");

    // Enable and configure reminder
    await userEvent.click(screen.getByLabelText("Set Reminder"));
    await userEvent.selectOptions(
      screen.getByLabelText("Reminder Type"),
      "email"
    );
    await userEvent.selectOptions(
      screen.getByLabelText("Reminder Time"),
      "24h"
    );

    const submitButton = screen.getByText("Schedule Appointment");
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          reminder: {
            type: "email",
            time: "24h",
          },
        })
      );
    });
  });
});
