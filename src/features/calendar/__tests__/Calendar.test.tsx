import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Calendar } from "../Calendar";
import { useAppointments } from "@/lib/hooks/useApi";
import { QueryObserverResult } from "@tanstack/react-query";
import {
  Appointment,
  AppointmentType,
  AppointmentStatus,
} from "@/lib/api/types";

const mockAppointments: Appointment[] = [
  {
    id: "1",
    patientId: "1",
    clientId: "1",
    providerId: "1",
    date: "2024-03-15",
    time: "09:00",
    startTime: new Date("2024-03-15T09:00:00"),
    endTime: new Date("2024-03-15T10:00:00"),
    type: "CHECK_UP" as AppointmentType,
    status: "SCHEDULED" as AppointmentStatus,
    notes: "Regular check-up",
    isRecurring: true,
    recurringPattern: {
      frequency: "WEEKLY",
      interval: 1,
      endDate: "2024-04-15",
    },
    reminder: {
      type: "EMAIL",
      time: "24h",
    },
    createdAt: "2024-03-14T10:00:00Z",
    updatedAt: "2024-03-14T10:00:00Z",
  },
  {
    id: "2",
    patientId: "2",
    clientId: "2",
    providerId: "1",
    date: "2024-03-16",
    time: "14:00",
    startTime: new Date("2024-03-16T14:00:00"),
    endTime: new Date("2024-03-16T15:00:00"),
    type: "VACCINATION" as AppointmentType,
    status: "SCHEDULED" as AppointmentStatus,
    notes: "Annual vaccination",
    isRecurring: false,
    createdAt: "2024-03-14T10:00:00Z",
    updatedAt: "2024-03-14T10:00:00Z",
  },
];

// Mock the useAppointments hook
vi.mock("@/lib/hooks/useAppointments", () => ({
  useAppointments: vi.fn(() => ({
    data: mockAppointments,
    isLoading: false,
    isError: false,
    error: null,
    isSuccess: true,
    status: "success" as const,
    isPending: false,
    isLoadingError: false,
    isRefetchError: false,
    isPlaceholderData: false,
    isRefetching: false,
    isStale: false,
    isFetching: false,
    failureCount: 0,
    failureReason: null,
    errorUpdateCount: 0,
    isFetched: true,
    isFetchedAfterMount: true,
    isInitialLoading: false,
    dataUpdatedAt: Date.now(),
    errorUpdatedAt: 0,
    refetch: () =>
      Promise.resolve({} as QueryObserverResult<Appointment[], Error>),
    fetchStatus: "idle" as const,
    isPaused: false,
    promise: Promise.resolve(mockAppointments),
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
}));

describe("Calendar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the calendar with appointments", async () => {
    render(<Calendar />);
    await waitFor(() => {
      expect(screen.getByText("March 2024")).toBeInTheDocument();
      expect(screen.getByText("15")).toBeInTheDocument();
    });
  });

  it("displays recurring appointments", async () => {
    render(<Calendar />);
    await waitFor(() => {
      const recurringAppointment = screen.getByText("Check-up - Max");
      expect(recurringAppointment).toBeInTheDocument();
      expect(screen.getByText("Recurring")).toBeInTheDocument();
    });
  });

  it("shows appointment details on hover", async () => {
    render(<Calendar />);
    const appointment = screen.getByText("Check-up - Max");
    await userEvent.hover(appointment);

    await waitFor(() => {
      expect(screen.getByText("Time: 09:00")).toBeInTheDocument();
      expect(screen.getByText("Client: John Smith")).toBeInTheDocument();
      expect(screen.getByText("Recurring: Weekly")).toBeInTheDocument();
      expect(
        screen.getByText("Reminder: Email (24h before)")
      ).toBeInTheDocument();
    });
  });

  it("navigates between months", async () => {
    render(<Calendar />);
    const nextMonthButton = screen.getByLabelText("Next month");
    await userEvent.click(nextMonthButton);

    await waitFor(() => {
      expect(screen.getByText("April 2024")).toBeInTheDocument();
    });

    const prevMonthButton = screen.getByLabelText("Previous month");
    await userEvent.click(prevMonthButton);

    await waitFor(() => {
      expect(screen.getByText("March 2024")).toBeInTheDocument();
    });
  });

  it("filters appointments by type", async () => {
    render(<Calendar />);
    const filterButton = screen.getByLabelText("Filter appointments");
    await userEvent.click(filterButton);

    const checkupFilter = screen.getByText("Check-up");
    await userEvent.click(checkupFilter);

    await waitFor(() => {
      expect(screen.getByText("Check-up - Max")).toBeInTheDocument();
      expect(screen.queryByText("Vaccination - Bella")).not.toBeInTheDocument();
    });
  });

  it("shows reminder indicators", async () => {
    render(<Calendar />);
    await waitFor(() => {
      const reminderIcon = screen.getByLabelText("Has reminder");
      expect(reminderIcon).toBeInTheDocument();
    });
  });

  it("handles appointment selection", async () => {
    const mockNavigate = vi.fn();
    vi.mock("react-router-dom", async () => {
      const actual = await vi.importActual("react-router-dom");
      return {
        ...actual,
        useNavigate: () => mockNavigate,
      };
    });

    render(<Calendar />);
    const appointment = screen.getByText("Check-up - Max");
    await userEvent.click(appointment);

    expect(mockNavigate).toHaveBeenCalledWith("/appointments/1");
  });

  it("shows loading state", async () => {
    vi.mocked(useAppointments).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      isSuccess: false,
      status: "pending" as const,
      isPending: true,
      isLoadingError: false,
      isRefetchError: false,
      isPlaceholderData: false,
      isRefetching: false,
      isStale: false,
      isFetching: true,
      failureCount: 0,
      failureReason: null,
      errorUpdateCount: 0,
      isFetched: false,
      isFetchedAfterMount: false,
      isInitialLoading: true,
      dataUpdatedAt: 0,
      errorUpdatedAt: 0,
      refetch: () =>
        Promise.resolve({} as QueryObserverResult<Appointment[], Error>),
      fetchStatus: "fetching" as const,
      isPaused: false,
      promise: Promise.resolve([]),
    } as QueryObserverResult<Appointment[], Error>);

    render(<Calendar />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("handles empty state", async () => {
    vi.mocked(useAppointments).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
      isSuccess: true,
      status: "success" as const,
      isPending: false,
      isLoadingError: false,
      isRefetchError: false,
      isPlaceholderData: false,
      isRefetching: false,
      isStale: false,
      isFetching: false,
      failureCount: 0,
      failureReason: null,
      errorUpdateCount: 0,
      isFetched: true,
      isFetchedAfterMount: true,
      isInitialLoading: false,
      dataUpdatedAt: Date.now(),
      errorUpdatedAt: 0,
      refetch: () =>
        Promise.resolve({
          data: [],
          isLoading: false,
          isError: false,
          error: null,
          isSuccess: true,
          status: "success" as const,
          isPending: false,
          isLoadingError: false,
          isRefetchError: false,
          isPlaceholderData: false,
          isRefetching: false,
          isStale: false,
          isFetching: false,
          failureCount: 0,
          failureReason: null,
          errorUpdateCount: 0,
          isFetched: true,
          isFetchedAfterMount: true,
          isInitialLoading: false,
          dataUpdatedAt: Date.now(),
          errorUpdatedAt: 0,
          refetch: () =>
            Promise.resolve({} as QueryObserverResult<Appointment[], Error>),
          fetchStatus: "idle" as const,
          isPaused: false,
          promise: Promise.resolve([]),
        } as QueryObserverResult<Appointment[], Error>),
      fetchStatus: "idle" as const,
      isPaused: false,
      promise: Promise.resolve([]),
    } as QueryObserverResult<Appointment[], Error>);

    render(<Calendar />);
    expect(screen.getByText("No appointments found")).toBeInTheDocument();
  });

  it("shows error state", async () => {
    vi.mocked(useAppointments).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error("Failed to fetch appointments"),
      isSuccess: false,
      status: "error" as const,
      isPending: false,
      isLoadingError: true,
      isRefetchError: false,
      isPlaceholderData: false,
      isRefetching: false,
      isStale: false,
      isFetching: false,
      failureCount: 1,
      failureReason: new Error("Failed to fetch appointments"),
      errorUpdateCount: 1,
      isFetched: true,
      isFetchedAfterMount: true,
      isInitialLoading: false,
      dataUpdatedAt: 0,
      errorUpdatedAt: Date.now(),
      refetch: () =>
        Promise.resolve({} as QueryObserverResult<Appointment[], Error>),
      fetchStatus: "idle" as const,
      isPaused: false,
      promise: Promise.resolve([]),
    } as QueryObserverResult<Appointment[], Error>);

    render(<Calendar />);
    expect(screen.getByText("Error loading appointments")).toBeInTheDocument();
  });
});
