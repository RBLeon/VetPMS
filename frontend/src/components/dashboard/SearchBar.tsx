// src/components/dashboard/SearchBar.tsx
import React, { useState } from "react";
import { Search } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "../ui/command";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  placeholder = "Zoeken...",
  className,
}: SearchBarProps) {
  const [open, setOpen] = useState(false);

  // Mock search results
  const searchResults = {
    clients: [
      { id: "1", name: "John Smith", email: "john.smith@example.com" },
      { id: "2", name: "Emma Johnson", email: "emma.johnson@example.com" },
      { id: "3", name: "Michael Brown", email: "michael.brown@example.com" },
    ],
    patients: [
      { id: "1", name: "Max", species: "Hond", breed: "Golden Retriever" },
      { id: "2", name: "Bella", species: "Kat", breed: "Siamees" },
      { id: "3", name: "Charlie", species: "Hond", breed: "Labrador" },
      { id: "4", name: "Luna", species: "Kat", breed: "Perzisch" },
    ],
    appointments: [
      {
        id: "1",
        date: "2023-04-15",
        time: "10:30",
        client: "John Smith",
        patient: "Max",
      },
      {
        id: "2",
        date: "2023-04-15",
        time: "11:15",
        client: "Emma Johnson",
        patient: "Bella",
      },
      {
        id: "3",
        date: "2023-04-15",
        time: "12:00",
        client: "Michael Brown",
        patient: "Charlie",
      },
    ],
  };

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className={cn(
          "relative h-10 w-full justify-start rounded-lg border bg-background px-4 text-sm font-normal text-muted-foreground shadow-none sm:pr-12",
          className
        )}
      >
        <Search className="mr-2 h-4 w-4" />
        <span className="flex-1 text-left">{placeholder}</span>
        <kbd className="pointer-events-none absolute right-2 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder={placeholder} />
        <CommandList>
          <CommandEmpty>Geen resultaten gevonden.</CommandEmpty>

          <CommandGroup heading="Klanten">
            {searchResults.clients.map((client) => (
              <CommandItem key={client.id}>
                <div className="flex flex-col">
                  <span>{client.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {client.email}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandGroup heading="Patiënten">
            {searchResults.patients.map((patient) => (
              <CommandItem key={patient.id}>
                <div className="flex flex-col">
                  <span>{patient.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {patient.species}, {patient.breed}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandGroup heading="Afspraken">
            {searchResults.appointments.map((appointment) => (
              <CommandItem key={appointment.id}>
                <div className="flex flex-col">
                  <span>
                    {appointment.date} om {appointment.time}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {appointment.patient} met {appointment.client}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
