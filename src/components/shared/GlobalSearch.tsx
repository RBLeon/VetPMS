import React, { useRef, useEffect } from "react";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "../../components/ui/command";
import { UserIcon, CalendarIcon, HomeIcon } from "lucide-react";

// Define a type for search result items
export interface SearchResultItem {
  id: string;
  type: string;
  name?: string;
  species?: string;
  breed?: string;
  email?: string;
  date?: string;
  time?: string;
}

interface GlobalSearchProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  results: SearchResultItem[] | null;
  isActive: boolean;
  onItemClick: (item: SearchResultItem) => void;
  onClose: () => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({
  value,
  onChange,
  results,
  isActive,
  onItemClick,
  onClose,
}) => {
  const commandRef = useRef<HTMLDivElement>(null);

  // Close search on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (commandRef.current && !commandRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  // Get icon based on item type
  const getItemIcon = (type: string) => {
    switch (type) {
      case "patient":
        return <UserIcon className="mr-2 h-4 w-4" />;
      case "client":
        return <UserIcon className="mr-2 h-4 w-4" />;
      case "appointment":
        return <CalendarIcon className="mr-2 h-4 w-4" />;
      default:
        return <HomeIcon className="mr-2 h-4 w-4" />;
    }
  };

  return (
    <div 
      className="absolute top-full right-0 w-96 mt-2 z-50"
      ref={commandRef}
    >
      <Command className="rounded-lg border shadow-md">
        <CommandInput
          placeholder="Search everything..."
          value={value}
          onValueChange={(value) => onChange({ target: { value } } as React.ChangeEvent<HTMLInputElement>)}
          autoFocus
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {isActive && results && results.length > 0 && (
            <CommandGroup heading="Results">
              {results.map((item) => (
                <CommandItem
                  key={`${item.type}-${item.id}`}
                  onSelect={() => onItemClick(item)}
                >
                  {getItemIcon(item.type)}
                  {item.type === "patient" && (
                    <span>{item.name} • {item.species} • {item.breed}</span>
                  )}
                  {item.type === "client" && (
                    <span>{item.name} • {item.email}</span>
                  )}
                  {item.type === "appointment" && (
                    <span>Appointment • {item.date} at {item.time}</span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </div>
  );
};

export default GlobalSearch;