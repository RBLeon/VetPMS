# Test Documentation

This document provides an overview of all tests in the VetPMS project.

## Test Setup

The project uses Vitest as the testing framework with the following configuration:

- Environment: jsdom
- Test files pattern: `src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}`
- Coverage reporting: text, JSON, and HTML formats
- Test timeout: 10000ms
- Global setup file: `src/test/setup.ts`

## Test Categories

### 1. Patient Management Tests

Location: `src/features/patients/__tests__/`

#### PatientList Tests

- Tests error handling for search failures
- Tests loading state display
- Tests patient list rendering and functionality

#### PatientForm Tests

- Tests back button presence
- Tests form submission error handling
- Tests form validation

### 2. Medical Records Tests

Location: `src/features/medical-records/__tests__/`

#### MedicalRecordForm Tests

- Tests form rendering
- Tests form submission
- Tests validation of required fields

### 3. Dashboard Tests

Location: `src/features/dashboard/__tests__/`

#### VeterinarianDashboard Tests

- Tests appointment display
- Tests patient information display
- Tests medical records integration

#### ReceptionistDashboard Tests

- Tests appointment management
- Tests client information display
- Tests patient list integration

### 4. Follow-up Tests

Location: `src/components/medical/__tests__/`

#### FollowUpHistory Tests

- Tests patient information display
- Tests follow-up appointment listing
- Tests appointment status display

#### FollowUpForm Tests

- Tests form field rendering
- Tests required field validation
- Tests form submission

### 5. Routing Tests

Location: `src/test/`

#### AppRoutes Tests

- Tests login page routing
- Tests role selection page routing
- Tests protected route functionality

### 6. API Integration Tests

Location: `src/hooks/__tests__/`

#### useMedicalRecords Tests

- Tests API integration
- Tests data fetching
- Tests error handling

## Test Utilities

The project includes several test utilities and mocks:

1. Global Mocks (in `src/test/setup.ts`):

   - ResizeObserver
   - IntersectionObserver
   - window.scrollTo
   - HTMLElement.prototype.scrollIntoView

2. Mock Data:
   - Test results data
   - Patient data
   - Medical records data

## Testing Best Practices

1. Each test file follows the pattern:

   - Import necessary dependencies
   - Set up mocks
   - Define test cases
   - Clean up after tests

2. Tests are organized using:

   - `describe` blocks for grouping related tests
   - `it` blocks for individual test cases
   - `beforeEach` and `afterEach` for setup and cleanup

3. Common testing patterns:
   - Component rendering tests
   - User interaction tests
   - Error handling tests
   - Loading state tests
   - Form validation tests

## Running Tests

To run the tests:

```bash
npm test
```

To run tests with coverage:

```bash
npm test -- --coverage
```

## Test Coverage

The project maintains test coverage reports in multiple formats:

- Text output in the console
- JSON format for CI integration
- HTML format for detailed coverage analysis

Coverage reports exclude:

- node_modules
- test setup files
- Build artifacts
