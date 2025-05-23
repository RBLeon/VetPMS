import type { TestResult } from "../types";

export const mockTestResults: TestResult[] = [
  {
    id: "1",
    patientId: "1",
    patientName: "Max",
    testType: "Bloedonderzoek",
    status: "VOLTOOID",
    orderedBy: "Dhr. Smit",
    orderedDate: "2024-03-15",
    completedDate: "2024-03-15",
    results: "Normale waarden",
    notes: "Geen bijzonderheden",
    priority: "middel",
  },
  {
    id: "2",
    patientId: "2",
    patientName: "Luna",
    testType: "Urineonderzoek",
    status: "IN_BEHANDELING",
    orderedBy: "Dhr. Jansen",
    orderedDate: "2024-03-16",
    completedDate: "",
    results: "",
    notes: "Wachten op resultaten",
    priority: "hoog",
  },
  {
    id: "3",
    patientId: "3",
    patientName: "Buddy",
    testType: "Röntgenfoto",
    status: "IN_AFWACHTING",
    orderedBy: "Dhr. Willems",
    orderedDate: "2024-03-17",
    completedDate: "",
    results: "",
    notes: "Gepland voor morgen",
    priority: "laag",
  },
];
