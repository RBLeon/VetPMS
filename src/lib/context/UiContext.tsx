import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";

export interface SearchResult {
  id: string;
  type: string;
  name?: string;
  [key: string]: unknown;
}

interface UiContextType {
  // Navigation state
  currentWorkspace: string | null;
  breadcrumb: BreadcrumbItem[];
  contextualActions: ContextualAction[];
  activeEntityId: string | null;
  activeEntityType: string | null;
  
  // UI controls
  sidebarOpen: boolean;
  isDarkMode: boolean;
  
  // UI methods
  setCurrentWorkspace: (workspace: string | null) => void;
  setBreadcrumb: (items: BreadcrumbItem[]) => void;
  setContextualActions: (actions: ContextualAction[]) => void;
  setActiveEntity: (type: string | null, id: string | null) => void;
  toggleSidebar: () => void;
  toggleDarkMode: () => void;
  
  // Search and global actions
  globalSearch: (query: string) => void;
  isSearchActive: boolean;
  searchResults: SearchResult[] | null;
  clearSearch: () => void;
}

export interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: string;
}

export interface ContextualAction {
  id: string;
  label: string;
  icon?: string;
  action: () => void;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  disabled?: boolean;
}

const UiContext = createContext<UiContextType | undefined>(undefined);

interface UiProviderProps {
  children: ReactNode;
}

export const UiProvider: React.FC<UiProviderProps> = ({ children }) => {
  const [currentWorkspace, setCurrentWorkspace] = useState<string | null>(null);
  const [breadcrumb, setBreadcrumb] = useState<BreadcrumbItem[]>([]);
  const [contextualActions, setContextualActions] = useState<ContextualAction[]>([]);
  const [activeEntityType, setActiveEntityType] = useState<string | null>(null);
  const [activeEntityId, setActiveEntityId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(null);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return newMode;
    });
  }, []);

  const setActiveEntity = useCallback((type: string | null, id: string | null) => {
    setActiveEntityType(type);
    setActiveEntityId(id);
  }, []);

  const globalSearch = useCallback((query: string) => {
    // In a real app, this would call an API
    setIsSearchActive(true);
    
    // Mock implementation for now
    if (query.length > 2) {
      const mockResults = [
        { id: '1', type: 'patient', name: 'Max', species: 'Dog', breed: 'Labrador' },
        { id: '2', type: 'client', name: 'John Smith', email: 'john@example.com' },
        { id: '3', type: 'appointment', date: '2025-04-15', time: '14:30' },
      ];
      setSearchResults(mockResults);
    } else {
      setSearchResults([]);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setIsSearchActive(false);
    setSearchResults(null);
  }, []);

  const value = {
    currentWorkspace,
    breadcrumb,
    contextualActions,
    activeEntityType,
    activeEntityId,
    sidebarOpen,
    isDarkMode,
    setCurrentWorkspace,
    setBreadcrumb,
    setContextualActions,
    setActiveEntity,
    toggleSidebar,
    toggleDarkMode,
    globalSearch,
    isSearchActive,
    searchResults,
    clearSearch,
  };

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
};

export const useUi = (): UiContextType => {
  const context = useContext(UiContext);
  if (context === undefined) {
    throw new Error("useUi must be used within a UiProvider");
  }
  return context;
};