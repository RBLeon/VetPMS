# VetPMS Development Standards & Patterns

## 1. Introduction

This document defines the development standards, patterns, and best practices for the VetPMS project. Following these guidelines ensures code consistency, maintainability, and alignment with the project's architectural vision.

## 2. Frontend Component Standards

### 2.1 Component Architecture

VetPMS uses a component-based architecture with React and TypeScript. Components should follow these structural patterns:

#### Component Organization

```
src/
├── components/           # UI components
│   ├── ui/               # Shadcn/UI base components
│   ├── layout/           # Layout components
│   ├── common/           # Shared components
│   └── features/         # Feature-specific components
├── pages/                # Page components
├── hooks/                # Custom hooks
├── contexts/             # React contexts
├── services/             # API services
├── utils/                # Utility functions
└── types/                # TypeScript types
```

#### Component Structure

Components should follow this consistent structure:

```tsx
// 1. Imports (grouped by category)
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Custom hooks and context
import { useAuth } from "@/lib/context/AuthContext";
import { useRole } from "@/lib/context/RoleContext";

// UI components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Icons and utilities
import { CalendarIcon, CheckCircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// 2. TypeScript interfaces
interface ComponentProps {
  data?: DataType[];
  isLoading?: boolean;
  error?: Error;
  onAction?: (id: string) => void;
}

// 3. Component definition
export const ComponentName: React.FC<ComponentProps> = ({
  data: propData,
  isLoading: propIsLoading,
  error: propError,
  onAction,
}) => {
  // 4. Hooks and state
  const { user } = useAuth();
  const { hasPermission } = useRole();
  const [localState, setLocalState] = useState();
  const navigate = useNavigate();
  
  // 5. Side effects
  useEffect(() => {
    // Effect logic
  }, [dependencies]);
  
  // 6. Event handlers and data processing functions
  const handleClick = () => {};
  const processData = () => {};
  
  // 7. Conditional rendering helpers
  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState />;
  
  // 8. Main render
  return (
    <div className="container mx-auto">
      {/* JSX content */}
    </div>
  );
};
```

### 2.2 Component Patterns

#### Role-Based Dashboard Pattern

```tsx
export const DashboardPage = () => {
  const { roleConfig } = useRole();
  
  // Render different dashboards based on role
  switch (roleConfig.name) {
    case 'veterinarian':
      return <VeterinarianDashboard />;
    case 'receptionist':
      return <ReceptionistDashboard />;
    case 'manager':
      return <ManagerDashboard />;
    default:
      return <StandardDashboard />;
  }
};
```

#### Data Override Pattern

This pattern allows for data to be passed via props or fetched via hooks:

```tsx
// In the component
export const PatientList: React.FC<PatientListProps> = ({
  // Direct data props
  patients: propPatients,
  isLoading: propIsLoading,
  error: propError,
  
  // Other props
  onPatientClick,
}) => {
  // Hook-based data fetching
  const { 
    data: hookPatients = [], 
    isLoading: hookIsLoading, 
    error: hookError 
  } = usePatients();
  
  // Props override hook data (for testing and flexibility)
  const patients = propPatients ?? hookPatients;
  const isLoading = propIsLoading ?? hookIsLoading;
  const error = propError ?? hookError;
  
  // Component logic and rendering
};
```

#### Feature-Gated Components

```tsx
export const FeatureGated: React.FC<{
  feature: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ feature, children, fallback = null }) => {
  const { hasFeature } = useRole();
  
  return hasFeature(feature) ? children : fallback;
};

// Usage
<FeatureGated feature="showAdvancedClinical">
  <AdvancedClinicalFeatures />
</FeatureGated>
```

#### List Component Pattern

```tsx
export const EntityList: React.FC<EntityListProps> = ({
  items,
  onItemClick,
  emptyMessage = "No items found",
  isLoading,
  renderItem,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 cursor-pointer"
          onClick={() => onItemClick?.(item.id)}
        >
          {renderItem ? renderItem(item) : (
            <div>
              <p className="font-medium">{item.title || item.name}</p>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
```

#### Form Component Pattern

```tsx
export const EntityForm: React.FC<EntityFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
  error,
}) => {
  const form = useForm({
    resolver: zodResolver(entitySchema),
    defaultValues: initialData || {
      // Default values
    },
  });
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-red-500 dark:bg-red-900/20 dark:text-red-300">
            {error.message}
          </div>
        )}
        
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* More fields */}
        
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
```

#### Card Component Pattern

```tsx
export const InformationCard: React.FC<InformationCardProps> = ({
  title,
  icon: Icon,
  value,
  description,
  className,
  iconColor = "text-[#3B82F6]",
  bgColor = "bg-[#3B82F6]/10 dark:bg-[#3B82F6]/20",
}) => {
  return (
    <Card className={cn("overflow-hidden", bgColor, className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={cn("h-4 w-4", iconColor)} />
      </CardHeader>
      <CardContent>
        <div className={cn("text-2xl font-bold", iconColor)}>
          {value}
        </div>
        <p className={cn("text-xs", iconColor)}>
          {description}
        </p>
      </CardContent>
    </Card>
  );
};
```

### 2.3 Custom Hooks

#### Data Fetching Hook Pattern

```tsx
export function useEntityData(entityId?: string) {
  const { currentTenant } = useTenant();
  
  return useQuery({
    queryKey: ['entity', entityId, currentTenant?.id],
    queryFn: () => EntityService.getEntity(entityId!, currentTenant?.id!),
    enabled: !!entityId && !!currentTenant?.id,
  });
}

// Usage
const { data: entity, isLoading, error } = useEntityData(id);
```

#### Tenant-Aware Hook Pattern

```tsx
export function useTenantQuery<T>(
  queryKey: any[],
  queryFn: (tenantId: string) => Promise<T>
) {
  const { currentTenant } = useTenant();
  const tenantId = currentTenant?.id;
  
  return useQuery({
    queryKey: [queryKey, tenantId],
    queryFn: () => queryFn(tenantId!),
    enabled: !!tenantId,
  });
}

// Usage
const { data: patients } = useTenantQuery(
  ['patients'],
  (tenantId) => PatientService.getPatients({ tenantId })
);
```

## 3. API Integration Standards

### 3.1 API Client Structure

VetPMS uses a centralized API client for all backend communication:

```typescript
// lib/api/apiClient.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { getAuthToken } from '../auth/authStorage';

const BASE_URL = process.env.REACT_APP_API_URL || 'https://api.vetpms.com/v1';

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      // Handle specific HTTP error codes
      switch (error.response.status) {
        case 401:
          // Unauthorized - redirect to login
          window.location.href = '/login';
          break;
        case 403:
          // Forbidden - handle permission error
          console.error('Permission denied');
          break;
        // Add other status code handlers as needed
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### 3.2 Resource API Services Pattern

Create dedicated service modules for each resource type:

```typescript
// lib/api/services/appointmentService.ts
import apiClient from '../apiClient';
import { Appointment, AppointmentCreate, AppointmentStatus } from '../types';

export const AppointmentService = {
  // GET all appointments with optional filters
  getAppointments: async (params?: {
    tenantId?: string;
    startDate?: string;
    endDate?: string;
    status?: AppointmentStatus;
    patientId?: string;
  }) => {
    const response = await apiClient.get<Appointment[]>('/appointments', { params });
    return response.data;
  },

  // GET a single appointment
  getAppointment: async (id: string) => {
    const response = await apiClient.get<Appointment>(`/appointments/${id}`);
    return response.data;
  },

  // POST create a new appointment
  createAppointment: async (appointment: AppointmentCreate) => {
    const response = await apiClient.post<Appointment>('/appointments', appointment);
    return response.data;
  },

  // PUT update an appointment
  updateAppointment: async (id: string, appointment: Partial<Appointment>) => {
    const response = await apiClient.put<Appointment>(`/appointments/${id}`, appointment);
    return response.data;
  },

  // PATCH update appointment status
  updateAppointmentStatus: async (id: string, status: AppointmentStatus) => {
    const response = await apiClient.patch<Appointment>(`/appointments/${id}/status`, { status });
    return response.data;
  },

  // DELETE an appointment
  deleteAppointment: async (id: string) => {
    const response = await apiClient.delete(`/appointments/${id}`);
    return response.data;
  },
};
```

### 3.3 React Query Integration Pattern

```typescript
// lib/hooks/useAppointments.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppointmentService } from '../api/services/appointmentService';
import { Appointment, AppointmentStatus } from '../api/types';
import { useTenant } from '../context/TenantContext';

// Custom hook for appointment queries
export function useAppointments(params?: {
  startDate?: string;
  endDate?: string;
  status?: AppointmentStatus;
  patientId?: string;
}) {
  const { currentTenant } = useTenant();
  const tenantId = currentTenant?.id;

  // Query key includes all parameters for proper caching
  const queryKey = ['appointments', tenantId, params];

  return useQuery({
    queryKey,
    queryFn: () => AppointmentService.getAppointments({ tenantId, ...params }),
    enabled: !!tenantId, // Only run if we have a tenant ID
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });
}

// Custom hook for creating appointments
export function useCreateAppointment() {
  const queryClient = useQueryClient();
  const { currentTenant } = useTenant();

  return useMutation({
    mutationFn: (appointment: Omit<Appointment, 'id'>) => {
      return AppointmentService.createAppointment({
        ...appointment,
        tenantId: currentTenant?.id!,
      });
    },
    onSuccess: () => {
      // Invalidate appointments queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}
```

### 3.4 Error Handling Pattern

Implement consistent error handling for API requests:

```typescript
// Error types
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ValidationError extends ApiError {
  fieldErrors: {
    field: string;
    message: string;
  }[];
}

export function isValidationError(error: unknown): error is ValidationError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'fieldErrors' in error &&
    Array.isArray((error as ValidationError).fieldErrors)
  );
}

// Component error handling
import { ErrorDisplay, ValidationErrorDisplay } from '@/components/ui/errors';
import { isValidationError } from '@/lib/api/types/errors';

export const AppointmentForm: React.FC<AppointmentFormProps> = ({ onSubmit }) => {
  const { mutate, isPending, error } = useCreateAppointment();
  const [form, setForm] = useState(initialFormState);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(form, {
      onSuccess: () => {
        onSubmit?.();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        isValidationError(error) ? (
          <ValidationErrorDisplay errors={error.fieldErrors} />
        ) : (
          <ErrorDisplay message="Failed to create appointment" error={error} />
        )
      )}
      
      {/* Form fields */}
      
      <Button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create Appointment'}
      </Button>
    </form>
  );
};
```

### 3.5 Optimistic Updates Pattern

```typescript
export function useOptimisticUpdateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Appointment> }) => {
      return AppointmentService.updateAppointment(id, data);
    },
    onMutate: async ({ id, data }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['appointment', id] });
      
      // Snapshot the previous value
      const previousAppointment = queryClient.getQueryData(['appointment', id]);
      
      // Optimistically update to the new value
      queryClient.setQueryData(['appointment', id], (old: Appointment) => ({
        ...old,
        ...data,
      }));
      
      // Return a context object with the previous value
      return { previousAppointment };
    },
    onError: (err, { id }, context) => {
      // If the mutation fails, revert to the previous value
      queryClient.setQueryData(['appointment', id], context?.previousAppointment);
    },
    onSettled: (data, error, { id }) => {
      // Always refetch after error or success to make sure cache is in sync
      queryClient.invalidateQueries({ queryKey: ['appointment', id] });
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}
```

### 3.6 Pagination Pattern

```typescript
// API Service
getPaginatedPatients: async (params?: {
  tenantId?: string;
  page?: number;
  pageSize?: number;
  searchQuery?: string;
}) => {
  const response = await apiClient.get<PaginatedResponse<Patient>>('/patients', { params });
  return response.data;
},

// React Query Hook
export function usePaginatedPatients(params: {
  page: number;
  pageSize: number;
  searchQuery?: string;
}) {
  const { currentTenant } = useTenant();
  const tenantId = currentTenant?.id;
  
  return useQuery({
    queryKey: ['patients', 'paginated', tenantId, params],
    queryFn: () => PatientService.getPaginatedPatients({
      tenantId,
      ...params,
    }),
    enabled: !!tenantId,
    keepPreviousData: true, // Keep previous page data while loading next page
  });
}
```

## 4. Style Guide

### 4.1 Color System

```typescript
const colors = {
  primary: {
    50: "#EFF6FF",
    100: "#DBEAFE",
    200: "#BFDBFE",
    300: "#93C5FD",
    400: "#60A5FA",
    500: "#3B82F6", // Primary brand
    600: "#2563EB",
    700: "#1D4ED8",
    800: "#1E40AF",
    900: "#1E3A8A",
  },
  secondary: {
    50: "#ECFDF5",
    100: "#D1FAE5",
    200: "#A7F3D0",
    300: "#6EE7B7",
    400: "#34D399",
    500: "#10B981", // Secondary accent
    600: "#059669",
    700: "#047857",
    800: "#065F46",
    900: "#064E3B",
  },
  accent: {
    50: "#F5F3FF",
    100: "#EDE9FE",
    200: "#DDD6FE",
    300: "#C4B5FD",
    400: "#A78BFA",
    500: "#8B5CF6", // Highlight color
    600: "#7C3AED",
    700: "#6D28D9",
    800: "#5B21B6",
    900: "#4C1D95",
  },
  success: "#22C55E",
  warning: "#F59E0B",
  error: "#EF4444",
  info: "#3B82F6",
};
```

### 4.2 Tailwind Usage Patterns

Use these color classes consistently:

```
// Primary colors (blue)
"bg-[#3B82F6]/10" // Light blue background (10% opacity)
"text-[#3B82F6]" // Blue text
"border-[#3B82F6]/20" // Blue border (20% opacity)

// Success colors (green)
"bg-[#10B981]/10" // Light green background
"text-[#10B981]" // Green text

// Accent colors (purple)
"bg-[#8B5CF6]/10" // Light purple background
"text-[#8B5CF6]" // Purple text

// Dark mode variants
"dark:bg-[#3B82F6]/20" // Dark mode background
"dark:text-[#3B82F6]" // Dark mode text
```

Class ordering convention:

1. Layout (display, position)
2. Spacing (margin, padding)
3. Sizing (width, height)
4. Typography (font, text)
5. Visual (colors, backgrounds, borders)
6. Interactive (hover, focus)

```tsx
// Good example
<div className="flex justify-between items-center p-4 w-full h-16 text-sm font-medium bg-white border-b hover:bg-gray-50">
  {/* content */}
</div>
```

### 4.3 Typography

```typescript
const typography = {
  fontFamily: {
    sans: ["Inter", "system-ui", "sans-serif"],
    display: ["DM Sans", "sans-serif"],
    mono: ["JetBrains Mono", "monospace"],
  },
  fontSize: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    base: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem", // 36px
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};
```

### 4.4 Component Spacing

Use consistent spacing within components:

```
// Card spacing
"p-4 space-y-4"

// Section spacing
"py-6 space-y-6"

// Container layout
"container mx-auto py-6 space-y-6"

// Grid layouts
"grid gap-4 md:grid-cols-2 lg:grid-cols-3"
"grid gap-4 md:grid-cols-2 lg:grid-cols-4"
```

### 4.5 Animation Patterns

```typescript
// Shared animation variants
export const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideIn: {
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 20, opacity: 0 },
  },
  scaleIn: {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.95, opacity: 0 },
  },
};

// Page transition wrapper
const PageTransition: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={animations.fadeIn}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
};
```

## 5. Testing Standards

### 5.1 Component Testing

```typescript
// Component test
import { render, screen, fireEvent } from '@testing-library/react';
import { ClientCard } from './ClientCard';

const mockClient = {
  id: '123',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '123-456-7890',
};

const mockOnClick = jest.fn();

describe('ClientCard', () => {
  it('renders client information correctly', () => {
    render(<ClientCard client={mockClient} onClick={mockOnClick} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('123-456-7890')).toBeInTheDocument();
  });
  
  it('calls onClick when clicked', () => {
    render(<ClientCard client={mockClient} onClick={mockOnClick} />);
    
    fireEvent.click(screen.getByText('John Doe'));
    
    expect(mockOnClick).toHaveBeenCalledWith('123');
  });
});
```

### 5.2 Testing with Providers

```typescript
// utils/test-utils.tsx
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';

// Create a custom render function
export function renderWithProviders(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & {
    route?: string;
    queryClient?: QueryClient;
  }
) {
  const {
    route = '/',
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    }),
    ...renderOptions
  } = options || {};
  
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[route]}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </MemoryRouter>
      </QueryClientProvider>
    );
  }
  
  return render(ui, { wrapper: Wrapper, ...renderOptions });
}
```

### 5.3 API Testing

```typescript
// Testing API hooks
import { renderHook, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { AllTheProviders } from '../testUtils';
import { useAppointments } from './useAppointments';

// Mock API data
const mockAppointments = [
  {
    id: 'appt-1',
    patientId: 'patient-1',
    patientName: 'Max',
    date: '2023-06-01',
    time: '14:30',
    status: 'SCHEDULED',
  },
  {
    id: 'appt-2',
    patientId: 'patient-2',
    patientName: 'Bella',
    date: '2023-06-01',
    time: '15:30',
    status: 'SCHEDULED',
  },
];

// Setup MSW server
const server = setupServer(
  rest.get('https://api.vetpms.com/v1/appointments', (req, res, ctx) => {
    return res(ctx.json(mockAppointments));
  })
);

describe('useAppointments', () => {
  it('fetches and returns appointments data', async () => {
    const { result } = renderHook(() => useAppointments(), {
      wrapper: AllTheProviders,
    });

    // Wait for data to load
    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    // Check data
    expect(result.current.data).toEqual(mockAppointments);
    expect(result.current.error).toBeNull();
  });
});
```

## 6. n8n Workflow Integration

### 6.1 Workflow Trigger Pattern

```typescript
// lib/api/services/workflowService.ts
import apiClient from '../apiClient';

export const WorkflowService = {
  triggerWorkflow: async (workflowKey: string, payload: any) => {
    const response = await apiClient.post(`/workflows/${workflowKey}/trigger`, payload);
    return response.data;
  },
  
  getWorkflowStatus: async (executionId: string) => {
    const response = await apiClient.get(`/workflows/executions/${executionId}`);
    return response.data;
  },
};

// Component implementation
function AppointmentReminderButton({ appointment }) {
  const { mutate: triggerWorkflow, isPending, isSuccess, error } = useTriggerWorkflow();
  
  const handleSendReminder = () => {
    triggerWorkflow({
      workflowKey: 'appointment-reminder',
      payload: {
        appointmentId: appointment.id,
        patientName: appointment.patientName,
        clientEmail: appointment.clientEmail,
        clientPhone: appointment.clientPhone,
        appointmentDate: appointment.date,
        appointmentTime: appointment.time,
      },
    });
  };
  
  return (
    <div>
      <Button
        onClick={handleSendReminder}
        disabled={isPending}
        variant="outline"
        size="sm"
        className="bg-[#3B82F6]/10 hover:bg-[#3B82F6]/20"
      >
        {isPending ? 'Sending...' : 'Send Reminder'}
      </Button>
      
      {isSuccess && (
        <p className="text-green-500 text-sm mt-1">Reminder sent successfully!</p>
      )}
      
      {error && (
        <p className="text-red-500 text-sm mt-1">Failed to send reminder</p>
      )}
    </div>
  );
}
```

### 6.2 Workflow Configuration

```typescript
// workflow-keys.ts
export const WorkflowKeys = {
  // Client communication
  APPOINTMENT_REMINDER: 'appointment-reminder',
  VACCINATION_REMINDER: 'vaccination-reminder',
  FOLLOW_UP_NOTIFICATION: 'follow-up-notification',
  
  // Clinical workflows
  LAB_RESULT_PROCESSING: 'lab-result-processing',
  PRESCRIPTION_NOTIFICATION: 'prescription-notification',
  
  // Business workflows
  INVOICE_GENERATION: 'invoice-generation',
  PAYMENT_PROCESSING: 'payment-processing',
};
```

## 7. Performance Optimization

### 7.1 React Query Optimization

```typescript
// Optimized query configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Only retry failed requests once
      retry: 1, 
      // Cache data for 5 minutes by default
      staleTime: 5 * 60 * 1000,
      // Revalidate when window is refocused
      refetchOnWindowFocus: true,
      // Don't refetch on component mount if data exists
      refetchOnMount: false,
    },
  },
});

// Prefetching pattern
const prefetchPatient = async (id: string) => {
  await queryClient.prefetchQuery({
    queryKey: ['patient', id],
    queryFn: () => PatientService.getPatient(id),
  });
};
```

### 7.2 Memoization Patterns

```typescript
// Memoize expensive components
import { memo } from 'react';

interface DataTableProps {
  data: any[];
  columns: any[];
}

export const DataTable = memo(({ data, columns }: DataTableProps) => {
  // Expensive rendering logic
  return (
    <table>
      {/* Table implementation */}
    </table>
  );
});

// Memoize expensive calculations
import { useMemo } from 'react';

function ExpensiveComponent({ data }) {
  // Memoize expensive calculation
  const processedData = useMemo(() => {
    return data.map(item => /* expensive calculation */);
  }, [data]);
  
  // Component rendering using processedData
}
```

### 7.3 Virtualization

```typescript
import { FixedSizeList } from 'react-window';

const VirtualizedList = ({ items }) => {
  const Row = ({ index, style }) => (
    <div style={style}>
      <Item data={items[index]} />
    </div>
  );

  return (
    <FixedSizeList
      height={500}
      width="100%"
      itemCount={items.length}
      itemSize={70}
    >
      {Row}
    </FixedSizeList>
  );
};
```

## 8. Accessibility Standards

### 8.1 Form Accessibility

```tsx
<FormField
  control={form.control}
  name="name"
  render={({ field }) => (
    <FormItem>
      <FormLabel htmlFor={field.name}>Name</FormLabel>
      <FormControl>
        <Input id={field.name} {...field} aria-describedby={`${field.name}-error`} />
      </FormControl>
      <FormMessage id={`${field.name}-error`} />
    </FormItem>
  )}
/>
```

### 8.2 Interactive Elements

```tsx
<Button
  onClick={handleClick}
  aria-label="Add patient"
  disabled={isDisabled}
>
  <PlusIcon className="h-4 w-4 mr-2" aria-hidden="true" />
  Add Patient
</Button>
```

### 8.3 Focus Management

```tsx
const Dialog = ({ isOpen, onClose, children }) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Focus first focusable element when dialog opens
      const focusableElements = dialogRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }
  }, [isOpen]);

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      tabIndex={-1}
    >
      <h2 id="dialog-title">Dialog Title</h2>
      {children}
      <button onClick={onClose}>Close</button>
    </div>
  );
};
```

## 9. Documentation Standards

### 9.1 Component Documentation

```tsx
/**
 * PatientCard displays a summary of patient information.
 * 
 * @param patient - The patient data to display
 * @param onClick - Optional click handler, receives patient ID
 * @param highlight - Whether to highlight the card
 * 
 * @example
 * <PatientCard 
 *   patient={patientData} 
 *   onClick={handlePatientClick} 
 * />
 */
export const PatientCard: React.FC<PatientCardProps> = ({
  patient,
  onClick,
  highlight = false,
}) => {
  // Component implementation
};
```

### 9.2 API Service Documentation

```typescript
/**
 * Service for appointment-related API operations.
 */
export const AppointmentService = {
  /**
   * Fetches appointments with optional filtering.
   * 
   * @param params - Optional parameters for filtering appointments
   * @returns Promise resolving to appointment array
   * 
   * @example
   * const appointments = await AppointmentService.getAppointments({
   *   startDate: '2023-06-01',
   *   status: 'SCHEDULED'
   * });
   */
  getAppointments: async (params?: AppointmentQueryParams) => {
    // Implementation
  },
  
  // Other methods...
};
```

## 10. Naming Conventions

### 10.1 File Naming

- React Components: `PascalCase.tsx` (e.g., `AppointmentCard.tsx`)
- Hooks: `use{ResourceName}.ts` (e.g., `useAppointments.ts`)
- Contexts: `{Name}Context.tsx` (e.g., `AuthContext.tsx`)
- Services: `{resource}Service.ts` (e.g., `patientService.ts`)
- Utilities: `camelCase.ts` (e.g., `formatDate.ts`)

### 10.2 Component Naming

- **Pages**: `{Name}Page` (e.g., `DashboardPage`)
- **Layouts**: `{Name}Layout` (e.g., `AppLayout`)
- **Feature Components**: `{Name}{Type}` (e.g., `AppointmentList`)
- **UI Components**: Brief, descriptive names (e.g., `Button`, `Card`)
- **HOCs**: `with{Feature}` (e.g., `withAuth`)

### 10.3 Variable & Function Naming

- Variables: `camelCase` (e.g., `patientData`)
- Constants: `UPPER_SNAKE_CASE` for true constants, `camelCase` for others
- Functions: `camelCase` verb phrases (e.g., `formatDate`, `handleSubmit`)
- Boolean variables: `is/has/should` prefix (e.g., `isLoading`, `hasError`)

## 11. Development Workflow

### 11.1 Git Workflow

- **Feature Branches**: Create from `development` branch
- **Branch Naming**: `feature/feature-name`, `bugfix/issue-name`
- **Commits**: Clear, descriptive commit messages
- **Pull Requests**: Detailed descriptions with screenshots if relevant
- **Code Reviews**: Required before merging

### 11.2 Development Environment

- Use consistent editor configuration (VS Code)
- Install ESLint and Prettier extensions
- Set up pre-commit hooks for linting and formatting
- Use TypeScript in strict mode

### 11.3 Debugging

- Use React Developer Tools for component inspection
- Use React Query Devtools for query debugging
- Use browser console sparingly (prefer structured logging)

## 12. Conclusion

These development standards and patterns provide a comprehensive guide for consistent, maintainable, and high-quality code in the VetPMS project. All team members should adhere to these standards to ensure a cohesive codebase and seamless collaboration.

By following these patterns, we can achieve:
- Consistent code style and architecture
- Improved maintainability and readability
- Better performance and user experience
- Easier onboarding for new team members
- Reduced bugs and technical debt

These standards should be treated as a living document, evolving with the project as new patterns emerge and best practices evolve.
