import { renderHook, act } from "@testing-library/react-hooks";
import { useMedicalRecords } from "../useMedicalRecords";
import { MedicalRecord } from "@/types/medical";

// Mock the API calls
jest.mock("@/services/api", () => ({
  getMedicalRecords: jest.fn(),
  addMedicalRecord: jest.fn(),
  updateMedicalRecord: jest.fn(),
  deleteMedicalRecord: jest.fn(),
}));

describe("useMedicalRecords", () => {
  const mockMedicalRecords: MedicalRecord[] = [
    {
      id: "1",
      patientId: "1",
      veterinarianId: "1",
      date: "2024-03-20",
      diagnosis: "Test diagnosis",
      treatment: "Test treatment",
      notes: "Test notes",
      followUpDate: "2024-03-27",
      status: "active",
      createdAt: "2024-03-20T10:00:00Z",
      updatedAt: "2024-03-20T10:00:00Z",
    },
  ];

  const mockNewMedicalRecord: Omit<
    MedicalRecord,
    "id" | "createdAt" | "updatedAt"
  > = {
    patientId: "1",
    veterinarianId: "1",
    date: "2024-03-20",
    diagnosis: "New diagnosis",
    treatment: "New treatment",
    notes: "New notes",
    followUpDate: "2024-03-27",
    status: "active",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches medical records successfully", async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useMedicalRecords("1")
    );

    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBe(null);

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.medicalRecords).toEqual(mockMedicalRecords);
  });

  it("handles error when fetching medical records", async () => {
    const error = new Error("Failed to fetch medical records");
    jest
      .spyOn(require("@/services/api"), "getMedicalRecords")
      .mockRejectedValueOnce(error);

    const { result, waitForNextUpdate } = renderHook(() =>
      useMedicalRecords("1")
    );

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe("Failed to fetch medical records");
    expect(result.current.medicalRecords).toEqual([]);
  });

  it("adds a new medical record successfully", async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useMedicalRecords("1")
    );

    await waitForNextUpdate();

    await act(async () => {
      await result.current.addMedicalRecord(mockNewMedicalRecord);
    });

    expect(result.current.medicalRecords).toContainEqual(
      expect.objectContaining({
        ...mockNewMedicalRecord,
        id: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })
    );
  });

  it("updates an existing medical record successfully", async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useMedicalRecords("1")
    );

    await waitForNextUpdate();

    const updatedRecord = {
      ...mockMedicalRecords[0],
      diagnosis: "Updated diagnosis",
    };

    await act(async () => {
      await result.current.updateMedicalRecord(updatedRecord);
    });

    expect(result.current.medicalRecords).toContainEqual(updatedRecord);
  });

  it("deletes a medical record successfully", async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useMedicalRecords("1")
    );

    await waitForNextUpdate();

    await act(async () => {
      await result.current.deleteMedicalRecord("1");
    });

    expect(result.current.medicalRecords).not.toContainEqual(
      mockMedicalRecords[0]
    );
  });

  it("handles error when adding a medical record", async () => {
    const error = new Error("Failed to add medical record");
    jest
      .spyOn(require("@/services/api"), "addMedicalRecord")
      .mockRejectedValueOnce(error);

    const { result, waitForNextUpdate } = renderHook(() =>
      useMedicalRecords("1")
    );

    await waitForNextUpdate();

    await act(async () => {
      await expect(
        result.current.addMedicalRecord(mockNewMedicalRecord)
      ).rejects.toThrow("Failed to add medical record");
    });

    expect(result.current.medicalRecords).not.toContainEqual(
      expect.objectContaining(mockNewMedicalRecord)
    );
  });

  it("handles error when updating a medical record", async () => {
    const error = new Error("Failed to update medical record");
    jest
      .spyOn(require("@/services/api"), "updateMedicalRecord")
      .mockRejectedValueOnce(error);

    const { result, waitForNextUpdate } = renderHook(() =>
      useMedicalRecords("1")
    );

    await waitForNextUpdate();

    const updatedRecord = {
      ...mockMedicalRecords[0],
      diagnosis: "Updated diagnosis",
    };

    await act(async () => {
      await expect(
        result.current.updateMedicalRecord(updatedRecord)
      ).rejects.toThrow("Failed to update medical record");
    });

    expect(result.current.medicalRecords).toContainEqual(mockMedicalRecords[0]);
  });

  it("handles error when deleting a medical record", async () => {
    const error = new Error("Failed to delete medical record");
    jest
      .spyOn(require("@/services/api"), "deleteMedicalRecord")
      .mockRejectedValueOnce(error);

    const { result, waitForNextUpdate } = renderHook(() =>
      useMedicalRecords("1")
    );

    await waitForNextUpdate();

    await act(async () => {
      await expect(result.current.deleteMedicalRecord("1")).rejects.toThrow(
        "Failed to delete medical record"
      );
    });

    expect(result.current.medicalRecords).toContainEqual(mockMedicalRecords[0]);
  });
});
