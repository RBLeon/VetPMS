import React from "react";
import { Input } from "./input";
import { Search } from "lucide-react";
import { cn } from "../../lib/utils";
import { useDebounce } from "../../hooks/useDebounce";

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch: (value: string) => void;
  debounceMs?: number;
}

export function SearchInput({
  onSearch,
  debounceMs = 300,
  className,
  ...props
}: SearchInputProps) {
  const [value, setValue] = React.useState("");
  const debouncedValue = useDebounce(value, debounceMs);

  React.useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Zoeken..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="pl-8"
        {...props}
      />
    </div>
  );
}
