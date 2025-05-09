import { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";

interface InventoryItem {
  id: string;
  name: string;
  category: "MEDICATION" | "SUPPLY" | "EQUIPMENT" | "FOOD";
  quantity: number;
  unit: string;
  reorderLevel: number;
  lastOrderedDate?: string;
  supplier: string;
  location: string;
  expiryDate?: string;
  status: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK" | "EXPIRED";
}

interface InventoryMetrics {
  totalItems: number;
  lowStockItems: number;
  outOfStockItems: number;
  expiringItems: number;
  value: number;
}

interface Inventory {
  items: InventoryItem[];
  metrics: InventoryMetrics;
}

interface InventoryContextType {
  data: Inventory | undefined;
  isLoading: boolean;
  error: Error | null;
}

const InventoryContext = createContext<InventoryContextType | undefined>(
  undefined
);

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const { data, isLoading, error } = useQuery<Inventory>({
    queryKey: ["inventory"],
    queryFn: async () => {
      // TODO: Replace with actual API call
      return {
        items: [
          {
            id: "1",
            name: "Amoxicillin 500mg",
            category: "MEDICATION",
            quantity: 100,
            unit: "tablets",
            reorderLevel: 50,
            lastOrderedDate: new Date().toISOString(),
            supplier: "MedSupply Co.",
            location: "Pharmacy Shelf A",
            expiryDate: "2024-12-31",
            status: "IN_STOCK",
          },
          {
            id: "2",
            name: "Surgical Gloves",
            category: "SUPPLY",
            quantity: 25,
            unit: "boxes",
            reorderLevel: 30,
            lastOrderedDate: new Date().toISOString(),
            supplier: "MedEquip Inc.",
            location: "Storage Room B",
            status: "LOW_STOCK",
          },
          {
            id: "3",
            name: "X-Ray Film",
            category: "SUPPLY",
            quantity: 0,
            unit: "boxes",
            reorderLevel: 10,
            lastOrderedDate: new Date().toISOString(),
            supplier: "MedEquip Inc.",
            location: "Storage Room A",
            status: "OUT_OF_STOCK",
          },
          {
            id: "4",
            name: "Prescription Diet",
            category: "FOOD",
            quantity: 15,
            unit: "bags",
            reorderLevel: 20,
            lastOrderedDate: new Date().toISOString(),
            supplier: "PetFood Co.",
            location: "Storage Room C",
            expiryDate: "2024-06-30",
            status: "LOW_STOCK",
          },
        ],
        metrics: {
          totalItems: 140,
          lowStockItems: 2,
          outOfStockItems: 1,
          expiringItems: 1,
          value: 25000,
        },
      };
    },
  });

  return (
    <InventoryContext.Provider
      value={{ data, isLoading, error: error as Error | null }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
}
