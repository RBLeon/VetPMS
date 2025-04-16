import React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";

export function ThemeToggle() {
  // Simulate next-themes functionality since we're not using Next.js
  const [theme, setTheme] = React.useState<"dark" | "light" | "system">("system");
  const [mounted, setMounted] = React.useState(false);

  // Update the theme only after mounting to avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
    
    // Check for system preference or stored preference
    const savedTheme = localStorage.getItem("theme");
    
    if (savedTheme) {
      setTheme(savedTheme as "dark" | "light" | "system");
      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } else {
      // Check system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
      if (prefersDark) {
        document.documentElement.classList.add("dark");
      }
    }
  }, []);

  // Toggle between light and dark
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Don't render anything until mounted to avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}