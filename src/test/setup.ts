import "@testing-library/jest-dom";
import { expect, afterEach, beforeAll, beforeEach } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";
import { setupGlobalMocks } from "./test-utils";
import { vi } from "vitest";

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

// Cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Clear all mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
});
