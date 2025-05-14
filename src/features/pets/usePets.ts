import { useState } from "react";

export interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  birthDate: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export function usePets() {
  const [pets, setPets] = useState<Pet[]>([]);

  const getPets = async (ownerId: string) => {
    // Return pets for the given owner from local state
    return pets.filter((pet) => pet.ownerId === ownerId);
  };

  const addPet = async (pet: Omit<Pet, "id" | "createdAt" | "updatedAt">) => {
    // Add a new pet to local state
    const newPet: Pet = {
      ...pet,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setPets((prev) => [...prev, newPet]);
    return newPet;
  };

  return {
    getPets,
    addPet,
  };
}
