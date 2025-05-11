import "@testing-library/jest-dom";
import { expect, afterEach, beforeAll, beforeEach } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";
import { setupGlobalMocks } from "./test-utils";
import { vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import React from "react";

// Extend Vitest's expect method with methods from react-testing-library
expect.extend(matchers);

// Setup global mocks before all tests
beforeAll(() => {
  setupGlobalMocks();
});

// Mock the window.matchMedia function
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock the ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock the IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock the window.scrollTo function
window.scrollTo = vi
  .fn()
  .mockImplementation((options?: ScrollToOptions | number, y?: number) => {
    if (typeof options === "number" && typeof y === "number") {
      // Handle scrollTo(x, y)
      return;
    }
    if (options && typeof options === "object") {
      // Handle scrollTo(options)
      return;
    }
  }) as typeof window.scrollTo;

// Mock the window.HTMLElement.prototype.scrollIntoView function
window.HTMLElement.prototype.scrollIntoView = vi.fn();

// Cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Clear all mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
});

// Create a custom render function that includes providers
const customRender = (ui: React.ReactElement, options = {}) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(ui, {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>{children}</BrowserRouter>
      </QueryClientProvider>
    ),
    ...options,
  });
};

// Re-export everything
export * from "@testing-library/react";
export { customRender as render };
