# VetPMS MVP UI Component Library

This document defines the essential UI components needed for the VetPMS MVP, focusing on core functionality with simplified implementation.

## Technology Stack

- **React** 18+
- **TypeScript** 5.0+
- **Tailwind CSS** 3.0+
- **Shadcn/ui** for base components
- **React Query** for data fetching
- **React Router** for navigation

## MVP Component Structure

```
src/
  components/
    ui/               # Shadcn/ui components
    common/           # Shared components
    layout/           # Layout components
    features/         # Feature-specific components
  pages/              # Page components
  hooks/              # Custom hooks
  services/           # API services
  types/              # TypeScript types
```

## Core Components

### Layout Components

#### AppLayout

Main application layout with header and sidebar.

```typescript
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export const AppLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
```

#### Header

Application header with user menu.

```typescript
export const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <h1 className="text-xl font-semibold">VetPMS</h1>
        <div className="flex items-center gap-4">
          <span>
            {user?.firstName} {user?.lastName}
          </span>
          <Button variant="outline" size="sm" onClick={logout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};
```

#### Sidebar

Navigation sidebar based on user role.

```typescript
export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/appointments", label: "Afspraken", icon: Calendar },
    { path: "/clients", label: "Klanten", icon: Users },
    { path: "/invoices", label: "Facturen", icon: FileText },
  ];

  return (
    <aside className="w-64 bg-white shadow-sm">
      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center gap-3 px-4 py-2 rounded-lg",
              location.pathname === item.path
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-100"
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};
```

### Common Components

#### PageHeader

Consistent page header with title and actions.

```typescript
interface PageHeaderProps {
  title: string;
  action?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, action }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      {action && <div>{action}</div>}
    </div>
  );
};
```

#### DataTable

Simple data table for listing records.

```typescript
interface Column<T> {
  key: keyof T;
  header: string;
  render?: (value: any, item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
}

export function DataTable<T>({ data, columns, onRowClick }: DataTableProps<T>) {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, index) => (
            <tr
              key={index}
              onClick={() => onRowClick?.(item)}
              className={onRowClick ? "hover:bg-gray-50 cursor-pointer" : ""}
            >
              {columns.map((column) => (
                <td
                  key={String(column.key)}
                  className="px-6 py-4 whitespace-nowrap"
                >
                  {column.render
                    ? column.render(item[column.key], item)
                    : String(item[column.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

#### SearchInput

Search input with debounce.

```typescript
interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = "Search...",
}) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [localValue, onChange]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="pl-10"
      />
    </div>
  );
};
```

### Feature Components

#### AppointmentList

List of appointments with basic functionality.

```typescript
interface AppointmentListProps {
  date: Date;
}

export const AppointmentList: React.FC<AppointmentListProps> = ({ date }) => {
  const { data: appointments, isLoading } = useQuery(
    ["appointments", date],
    () => appointmentService.getByDate(date)
  );

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-2">
      {appointments?.map((appointment) => (
        <div
          key={appointment.id}
          className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
        >
          <div>
            <div className="font-medium">{appointment.patientName}</div>
            <div className="text-sm text-gray-600">
              {format(new Date(appointment.startTime), "h:mm a")} -
              {appointment.clientName}
            </div>
          </div>
          <Badge
            variant={
              appointment.status === "Scheduled" ? "default" : "secondary"
            }
          >
            {appointment.status}
          </Badge>
        </div>
      ))}
    </div>
  );
};
```

#### ClientForm

Form for creating/editing clients.

```typescript
interface ClientFormProps {
  client?: Client;
  onSubmit: (data: ClientFormData) => Promise<void>;
  onCancel: () => void;
}

export const ClientForm: React.FC<ClientFormProps> = ({
  client,
  onSubmit,
  onCancel,
}) => {
  const form = useForm<ClientFormData>({
    defaultValues: client || {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* More fields... */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
};
```

#### MedicalRecordForm

Simple SOAP note form.

```typescript
interface MedicalRecordFormProps {
  patientId: string;
  appointmentId?: string;
  onSubmit: (data: MedicalRecordFormData) => Promise<void>;
}

export const MedicalRecordForm: React.FC<MedicalRecordFormProps> = ({
  patientId,
  appointmentId,
  onSubmit,
}) => {
  const form = useForm<MedicalRecordFormData>({
    defaultValues: {
      patientId,
      appointmentId,
      chiefComplaint: "",
      subjective: "",
      objective: "",
      assessment: "",
      plan: "",
      prescriptions: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>SOAP Note</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="chiefComplaint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chief Complaint</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subjective"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subjective</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} />
                  </FormControl>
                </FormItem>
              )}
            />
            {/* More SOAP fields... */}
          </CardContent>
        </Card>
        <Button type="submit">Save Medical Record</Button>
      </form>
    </Form>
  );
};
```

## Custom Hooks

#### useAuth

Authentication hook for user management.

```typescript
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password);
    setUser(response.user);
    localStorage.setItem("token", response.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return { user, login, logout, isAuthenticated: !!user };
};
```

#### useDebounce

Debounce hook for search inputs.

```typescript
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

## Theme Configuration

Using Tailwind CSS with custom configuration:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f7ff",
          // ... other shades
          600: "#0055A4", // Main brand color
        },
      },
    },
  },
  plugins: [],
};
```

## Development Guidelines

### MVP Component Principles

1. **Keep It Simple**: Focus on functionality over fancy UI
2. **Use Shadcn/ui**: Leverage pre-built components when possible
3. **Mobile-Friendly**: Ensure basic responsiveness
4. **Type Safety**: Use TypeScript for all components
5. **Error Handling**: Basic error states and loading indicators

### File Organization

```typescript
// ComponentName.tsx
import React from "react";
import { ComponentProps } from "./ComponentName.types";

export const ComponentName: React.FC<ComponentProps> = (props) => {
  // Component logic
  return <div>Component content</div>;
};

// ComponentName.types.ts
export interface ComponentProps {
  // Props definition
}
```

## Future Enhancements

After MVP, these components will be enhanced with:

- Advanced animations and transitions
- Complex form validation
- Drag-and-drop scheduling
- Real-time updates
- Offline support
- Advanced accessibility features

This MVP component library provides the foundation for rapid development while maintaining code quality and user experience standards.
