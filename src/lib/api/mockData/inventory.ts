import type { InventoryItem } from "../types";

export const mockInventoryItems: InventoryItem[] = [
  {
    id: "1",
    name: "Dog Food - Premium",
    description: "High-quality premium dog food",
    category: "Food",
    quantity: 50,
    unit: "kg",
    cost: 49.99,
    supplier: "Pet Supplies Co",
    reorderLevel: 10,
    expiryDate: "2024-12-31",
    location: "Warehouse A",
    createdAt: "2024-03-19T10:00:00Z",
    updatedAt: "2024-03-19T10:00:00Z",
  },
  {
    id: "2",
    name: "Cat Litter",
    description: "Premium clumping cat litter",
    category: "Supplies",
    quantity: 30,
    unit: "bags",
    cost: 19.99,
    supplier: "Pet Supplies Co",
    reorderLevel: 5,
    expiryDate: "2024-12-31",
    location: "Warehouse B",
    createdAt: "2024-03-19T10:00:00Z",
    updatedAt: "2024-03-19T10:00:00Z",
  },
];
