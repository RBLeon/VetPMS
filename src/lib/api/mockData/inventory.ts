import type { InventoryItem } from "../types";

export const mockInventoryItems: InventoryItem[] = [
  {
    id: "1",
    name: "Hondenvoer - Premium",
    description: "Hoogwaardig premium hondenvoer",
    category: "VOER",
    quantity: 50,
    unit: "kg",
    cost: 49.99,
    supplier: "Dierenspeciaalzaak BV",
    reorderLevel: 10,
    expiryDate: "2024-12-31",
    location: "Magazijn A",
    createdAt: "2024-03-19T10:00:00Z",
    updatedAt: "2024-03-19T10:00:00Z",
  },
  {
    id: "2",
    name: "Kattenbakvulling",
    description: "Premium klonterende kattenbakvulling",
    category: "MATERIAAL",
    quantity: 30,
    unit: "zakken",
    cost: 19.99,
    supplier: "Dierenspeciaalzaak BV",
    reorderLevel: 5,
    expiryDate: "2024-12-31",
    location: "Magazijn B",
    createdAt: "2024-03-19T10:00:00Z",
    updatedAt: "2024-03-19T10:00:00Z",
  },
];
