import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";

interface TestWrapperProps {
  children: React.ReactNode;
  initialRoute?: string;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export const TestWrapper: React.FC<TestWrapperProps> = ({
  children,
  initialRoute = "/",
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialRoute]}>
        {children}
        <Toaster />
      </MemoryRouter>
    </QueryClientProvider>
  );
};

export const renderWithProviders = (
  ui: React.ReactElement,
  { initialRoute = "/" } = {}
) => {
  return render(ui, {
    wrapper: ({ children }) => (
      <TestWrapper initialRoute={initialRoute}>{children}</TestWrapper>
    ),
  });
};

// Mock ResizeObserver since it's not available in jsdom
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Setup global mocks
function setupGlobalMocks() {
  global.ResizeObserver = ResizeObserverMock;
}

// Re-export everything
export * from "@testing-library/react";
export { render, setupGlobalMocks };
