// src/components/theme-toggle.tsx
import React from "react";
import { useUi } from "../lib/context/UiContext";
import { Button } from "./ui/button";
import { MoonIcon, SunIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function ThemeToggle() {
  const { toggleDarkMode } = useUi(); // Removed isDarkMode since it's not directly used

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => toggleDarkMode(false)}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => toggleDarkMode(true)}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => {
          if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            toggleDarkMode(false);
          } else {
            toggleDarkMode(true);
          }
        }}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}