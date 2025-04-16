# VetPMS UI Component Library

## Overview

This document provides technical specifications for the VetPMS UI Component Library, which implements the Visual Design System. It serves as a reference for frontend developers working on the VetPMS web and mobile interfaces, detailing component APIs, behaviors, and implementation guidelines.

## Technology Stack

- **Core Framework**: React 18+
- **Language**: TypeScript 5.0+
- **Styling**: Tailwind CSS with custom theme configuration
- **Component System**: Custom components with atomic design principles
- **State Management**: Redux Toolkit for application state
- **Form Handling**: React Hook Form for form state and validation
- **Accessibility**: WCAG 2.1 AA compliant components

## Component Architecture

### Directory Structure

```
src/
  components/
    atoms/            # Basic building blocks (Button, Input, Icon, etc.)
    molecules/        # Compositions of atoms (FormField, SearchBox, etc.)
    organisms/        # Complex UI components (PatientBanner, AppointmentCard, etc.)
    templates/        # Page layouts and sections
    pages/            # Fully composed pages
    context/          # React context providers
    hooks/            # Custom React hooks
    utils/            # Utility functions
  theme/              # Theme configuration
  services/           # API and service interaction
  store/              # Redux store configuration
  types/              # TypeScript type definitions
```

### Component Structure

Each component follows a standardized structure:

```typescript
// Button.tsx
import React from 'react';
import { cn } from '@/utils/classNames';
import { ButtonProps } from './Button.types';

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  fullWidth = false,
  onClick,
  className,
  ...props
}) => {
  const baseStyles = 'font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantStyles = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-white border border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
    tertiary: 'bg-transparent text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
    destructive: 'bg-error-600 text-white hover:bg-error-700 focus:ring-error-500'
  };
  
  const sizeStyles = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg'
  };
  
  const widthStyles = fullWidth ? 'w-full' : '';
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : '';
  
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        widthStyles,
        disabledStyles,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
```

```typescript
// Button.types.ts
export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'destructive';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button visual style variant
   * @default 'primary'
   */
  variant?: ButtonVariant;
  
  /**
   * Button size variant
   * @default 'medium'
   */
  size?: ButtonSize;
  
  /**
   * Whether the button should take full width of its container
   * @default false
   */
  fullWidth?: boolean;
  
  /**
   * Button content
   */
  children: React.ReactNode;
}
```

## Core Components

### Atoms

#### Button

Button component for triggering actions.

```typescript
import { Button } from '@/components/atoms/Button';

// Usage examples
<Button>Default Button</Button>
<Button variant="secondary" size="small">Small Secondary</Button>
<Button variant="destructive" disabled>Disabled Destructive</Button>
<Button fullWidth>Full Width Button</Button>
<Button onClick={() => console.log('Clicked!')}>Click Handler</Button>
```

#### Input

Text input field for collecting user input.

```typescript
import { Input } from '@/components/atoms/Input';

// Usage examples
<Input placeholder="Enter your name" />
<Input type="email" placeholder="Email address" error="Invalid email format" />
<Input value={value} onChange={handleChange} disabled />
```

#### Select

Dropdown selection component.

```typescript
import { Select } from '@/components/atoms/Select';

// Usage examples
<Select 
  options={[
    { value: 'dog', label: 'Dog' },
    { value: 'cat', label: 'Cat' },
    { value: 'other', label: 'Other' }
  ]}
  placeholder="Select species"
  onChange={handleSpeciesChange}
/>
```

#### Checkbox

Checkbox input component.

```typescript
import { Checkbox } from '@/components/atoms/Checkbox';

// Usage examples
<Checkbox label="I agree to the terms" checked={agreed} onChange={handleChange} />
<Checkbox label="Send me updates" disabled />
```

#### Icon

Icon component for displaying vector icons.

```typescript
import { Icon } from '@/components/atoms/Icon';

// Usage examples
<Icon name="calendar" />
<Icon name="alert-circle" color="error" size="large" />
```

#### Badge

Badge component for status indicators and counters.

```typescript
import { Badge } from '@/components/atoms/Badge';

// Usage examples
<Badge variant="status" status="success">Active</Badge>
<Badge variant="counter">5</Badge>
<Badge variant="status" status="warning">Pending</Badge>
```

### Molecules

#### FormField

Composition of a form control with label and error message.

```typescript
import { FormField } from '@/components/molecules/FormField';
import { Input } from '@/components/atoms/Input';

// Usage examples
<FormField label="Email Address" required errorMessage={errors.email}>
  <Input 
    type="email" 
    placeholder="Enter your email" 
    value={email}
    onChange={handleEmailChange}
    error={Boolean(errors.email)}
  />
</FormField>
```

#### SearchBox

Search input with integrated icon and clear button.

```typescript
import { SearchBox } from '@/components/molecules/SearchBox';

// Usage examples
<SearchBox 
  placeholder="Search patients" 
  value={searchQuery}
  onChange={handleSearchChange}
  onSearch={handleSearch}
/>
```

#### AlertBanner

Contextual message banner for notifications and alerts.

```typescript
import { AlertBanner } from '@/components/molecules/AlertBanner';

// Usage examples
<AlertBanner 
  type="info"
  title="System Maintenance"
  message="The system will be unavailable on Sunday from 2-4 AM for scheduled maintenance."
  dismissible
/>

<AlertBanner 
  type="error"
  title="Connection Error"
  message="Unable to connect to the server. Please try again later."
  action={{
    label: 'Retry',
    onClick: handleRetryConnection
  }}
/>
```

#### DatePicker

Date selection component.

```typescript
import { DatePicker } from '@/components/molecules/DatePicker';

// Usage examples
<DatePicker 
  label="Appointment Date"
  value={appointmentDate}
  onChange={handleDateChange}
  minDate={new Date()}
  disabledDates={[new Date('2025-12-25'), new Date('2026-01-01')]}
/>
```

### Organisms

#### PatientBanner

Prominent display of critical patient information.

```typescript
import { PatientBanner } from '@/components/organisms/PatientBanner';

// Usage examples
<PatientBanner
  patient={{
    id: 'patient_123',
    name: 'Max',
    species: 'Canine',
    breed: 'Golden Retriever',
    dateOfBirth: '2020-06-15',
    gender: 'MALE',
    weight: { value: 30.5, unit: 'kg' },
    alerts: [
      { type: 'MEDICAL', description: 'Allergic to penicillin', severity: 'HIGH' }
    ]
  }}
  owner={{
    id: 'client_456',
    firstName: 'Jane',
    lastName: 'Doe',
    phone: '+13105551234'
  }}
  onEditClick={handleEditPatient}
/>
```

#### AppointmentScheduler

Complex appointment scheduling interface.

```typescript
import { AppointmentScheduler } from '@/components/organisms/AppointmentScheduler';

// Usage examples
<AppointmentScheduler
  date={selectedDate}
  providers={providers}
  appointments={appointments}
  resources={resources}
  onDateChange={handleDateChange}
  onAppointmentSelect={handleAppointmentSelect}
  onAppointmentCreate={handleAppointmentCreate}
  viewMode="day"
/>
```

#### MedicalRecordViewer

Medical record display with expandable sections.

```typescript
import { MedicalRecordViewer } from '@/components/organisms/MedicalRecordViewer';

// Usage examples
<MedicalRecordViewer
  record={medicalRecord}
  editable={userCanEdit}
  onEdit={handleEditRecord}
  expandedSections={['soap', 'attachments']}
  onExpandSection={handleExpandSection}
/>
```

#### SOAPNoteEditor

Structured editor for creating and editing SOAP notes.

```typescript
import { SOAPNoteEditor } from '@/components/organisms/SOAPNoteEditor';

// Usage examples
<SOAPNoteEditor
  initialValues={{
    subjective: 'Patient presented for annual check-up.',
    objective: 'Weight: 30.5kg, Temperature: 101.2F',
    assessment: 'Healthy adult neutered male',
    plan: '1. Continue current diet\n2. Annual vaccinations administered'
  }}
  onSave={handleSaveSoapNote}
  aiAssistEnabled={true}
  onRequestAIAssistance={handleAIRequest}
  readOnly={false}
/>
```

## Context-Aware UI Components

### ContextProvider

Context provider for role-based UI adaptation.

```typescript
import { ContextProvider } from '@/components/context/ContextProvider';

// Usage example
<ContextProvider
  user={currentUser}
  role={userRole}
  permissions={userPermissions}
  tenant={currentTenant}
  currentContext={{
    type: 'PATIENT_VISIT',
    entityId: 'visit_123',
    relatedEntities: {
      patientId: 'patient_456',
      clientId: 'client_789',
      appointmentId: 'appointment_101'
    }
  }}
>
  <App />
</ContextProvider>
```

### AdaptiveContainer

Container that renders different content based on user context.

```typescript
import { AdaptiveContainer } from '@/components/context/AdaptiveContainer';

// Usage example
<AdaptiveContainer
  roleVariants={{
    'VETERINARIAN': <ClinicalView data={patientData} />,
    'RECEPTIONIST': <AppointmentView data={appointmentData} />,
    'PRACTICE_MANAGER': <FinancialView data={financialData} />,
    'DEFAULT': <BasicView data={basicData} />
  }}
/>
```

### PermissionGated

Component that conditionally renders based on user permissions.

```typescript
import { PermissionGated } from '@/components/context/PermissionGated';

// Usage example
<PermissionGated permissions={['medical_records:write']}>
  <Button onClick={handleEditRecord}>Edit Record</Button>
</PermissionGated>
```

## Hooks

### useContext

Hook for accessing the current application context.

```typescript
import { useContext } from '@/components/hooks/useContext';

function MyComponent() {
  const { currentUser, currentRole, currentContext, permissions } = useContext();
  
  return (
    <div>
      {currentRole === 'VETERINARIAN' && <VeterinarianDashboard />}
      {permissions.includes('patients:write') && <EditPatientButton />}
    </div>
  );
}
```

### useAdaptiveUI

Hook for dynamically adapting UI based on context.

```typescript
import { useAdaptiveUI } from '@/components/hooks/useAdaptiveUI';

function AdaptiveView() {
  const { getComponentsForContext, isComponentVisible } = useAdaptiveUI();
  
  const medicalComponents = getComponentsForContext('MEDICAL_VIEW');
  
  return (
    <div className="adaptive-container">
      {isComponentVisible('PatientVitals') && <PatientVitals />}
      {medicalComponents.map(component => <component.Component {...component.props} />)}
    </div>
  );
}
```

## Theming

### Theme Configuration

The theming system is based on Tailwind CSS with a custom configuration.

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7ff',
          100: '#e0efff',
          200: '#b9defe',
          300: '#7cc0fd',
          400: '#3aa0f9',
          500: '#0055A4',  // Primary Blue
          600: '#0055A4',
          700: '#00407B',  // Darker Blue
          800: '#002c59',
          900: '#001f3f'
        },
        accent: {
          50: '#ebfef7',
          100: '#d0feee',
          200: '#a4f9da',
          300: '#67edc0',
          400: '#33bc96',  // Accent Green
          500: '#00A878',
          600: '#00A878',  // Accent Green
          700: '#007F5C',  // Darker Green
          800: '#00513b',
          900: '#003024'
        },
        neutral: {
          50: '#F8F8F8',  // Lightest
          100: '#EFEFEF',
          200: '#DDDDDD',  // Light
          300: '#C0C0C0',
          400: '#A0A0A0',
          500: '#767676',  // Medium
          600: '#5A5A5A',
          700: '#4A4A4A',  // Dark
          800: '#303030',
          900: '#1A1A1A'   // Darkest
        },
        success: {
          50: '#edf9ee',
          100: '#c9eacc',
          200: '#a6dca9',
          300: '#77ca7b',
          400: '#52b957',
          500: '#2E7D32',  // Success
          600: '#2a7130',
          700: '#236129',
          800: '#1a4b1f',
          900: '#123615'
        },
        warning: {
          50: '#fef9e7',
          100: '#fcefbf',
          200: '#fae196',
          300: '#f8d26d',
          400: '#f9a825',  // Warning
          500: '#f49b0d',
          600: '#e18a02',
          700: '#cb7300',
          800: '#a15c00',
          900: '#7b4800'
        },
        error: {
          50: '#feedee',
          100: '#fcd0d3',
          200: '#f8a2a8',
          300: '#f37982',
          400: '#e5484d',
          500: '#d32f2f',  // Error
          600: '#c0262a',
          700: '#a61f24',
          800: '#85191e',
          900: '#6a1419'
        },
        info: {
          50: '#eef8fe',
          100: '#d4ebfc',
          200: '#a9dbfa',
          300: '#78c2f5',
          400: '#45a5ef',
          500: '#0277BD',  // Info
          600: '#0665a8',
          700: '#05558d',
          800: '#044271',
          900: '#03325a'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      spacing: {
        'xxxs': '2px',
        'xxs': '4px',
        'xs': '8px',
        'sm': '12px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        'xxl': '48px',
        'xxxl': '64px'
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'full': '9999px'
      },
      boxShadow: {
        'level-1': '0px 1px 3px rgba(0, 0, 0, 0.1)',
        'level-2': '0px 3px 6px rgba(0, 0, 0, 0.15)',
        'level-3': '0px 6px 12px rgba(0, 0, 0, 0.2)',
        'level-4': '0px 12px 24px rgba(0, 0, 0, 0.25)'
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ]
};
```

### Theme Context

Context provider for theme management, including dark mode support.

```typescript
import { ThemeProvider } from '@/components/context/ThemeProvider';

// Usage example
<ThemeProvider initialTheme="light" userPreference={userThemePreference}>
  <App />
</ThemeProvider>
```

## Accessibility Features

### Focus Management

Utilities for managing focus in complex interfaces.

```typescript
import { useFocusTrap } from '@/components/hooks/useFocusTrap';

function Modal({ isOpen, onClose, children }) {
  const modalRef = useFocusTrap(isOpen);
  
  if (!isOpen) return null;
  
  return (
    <div className="modal-backdrop">
      <div 
        ref={modalRef}
        className="modal-content"
        role="dialog"
        aria-modal="true"
      >
        <Button aria-label="Close" onClick={onClose}>×</Button>
        {children}
      </div>
    </div>
  );
}
```

### Screen Reader Announcements

Utility for announcing dynamic changes to screen reader users.

```typescript
import { useAnnouncement } from '@/components/hooks/useAnnouncement';

function PatientList() {
  const announce = useAnnouncement();
  const [patients, setPatients] = useState([]);
  
  const handleSearch = async (query) => {
    const results = await searchPatients(query);
    setPatients(results);
    announce(`${results.length} patients found`);
  };
  
  return (
    <div>
      <SearchBox onSearch={handleSearch} />
      <ul>
        {patients.map(patient => <PatientListItem key={patient.id} patient={patient} />)}
      </ul>
    </div>
  );
}
```

## Mobile-Specific Components

### BottomNavigation

Mobile-specific bottom navigation bar.

```typescript
import { BottomNavigation, BottomNavigationItem } from '@/components/mobile/BottomNavigation';

// Usage example
<BottomNavigation activeItemId="appointments">
  <BottomNavigationItem 
    id="dashboard" 
    label="Dashboard" 
    icon="home" 
    href="/dashboard" 
  />
  <BottomNavigationItem 
    id="appointments" 
    label="Appointments" 
    icon="calendar" 
    href="/appointments" 
  />
  <BottomNavigationItem 
    id="patients" 
    label="Patients" 
    icon="users" 
    href="/patients" 
  />
  <BottomNavigationItem 
    id="messages" 
    label="Messages" 
    icon="message-circle" 
    href="/messages" 
    badge={5} 
  />
</BottomNavigation>
```

### SwipeableView

Swipeable content container for mobile interfaces.

```typescript
import { SwipeableView } from '@/components/mobile/SwipeableView';

// Usage example
<SwipeableView
  items={[
    { id: 'info', content: <PatientInfo patient={patient} /> },
    { id: 'history', content: <PatientHistory patientId={patient.id} /> },
    { id: 'images', content: <PatientImages patientId={patient.id} /> }
  ]}
  initialItemId="info"
  onSwipe={handleSwipe}
/>
```

## Component Development Guidelines

### Component Checklist

- [ ] Component has a clear, single responsibility
- [ ] Props are well-documented with TypeScript types
- [ ] Default prop values are defined where appropriate
- [ ] Component is accessible (keyboard navigation, ARIA attributes, etc.)
- [ ] Component supports theming and dark mode
- [ ] Component adapts appropriately to mobile viewports
- [ ] Tests cover main functionality and edge cases
- [ ] Performance is optimized (memoization, etc. where needed)

### Best Practices

1. **Use Composition**: Build complex components by composing simpler ones
2. **Props for Configuration**: Use props to configure component behavior
3. **Context for Global State**: Use context for theme, user preferences, etc.
4. **Controlled vs Uncontrolled**: Support both patterns where appropriate
5. **Accessibility First**: Design with accessibility in mind from the start
6. **Responsive Design**: Ensure components work well on all screen sizes
7. **Performance**: Optimize for performance to support complex application UIs
8. **Testing**: Write comprehensive tests for component functionality

### Testing Strategy

Components should be tested using a combination of:

1. **Unit Tests**: Test individual component rendering and functionality
2. **Integration Tests**: Test component interactions
3. **Visual Regression Tests**: Ensure visual consistency across changes
4. **Accessibility Tests**: Verify accessibility compliance

```typescript
// Button.test.tsx example
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  test('renders correctly with default props', () => {
    render(<Button>Click Me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-primary-600'); // Primary button style
  });
  
  test('applies variant styles correctly', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByRole('button', { name: /secondary/i });
    expect(button).toHaveClass('border-primary-600');
    expect(button).not.toHaveClass('bg-primary-600');
  });
  
  test('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    fireEvent.click(screen.getByRole('button', { name: /click me/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  test('respects disabled state', () => {
    const handleClick = jest.fn();
    render(<Button disabled onClick={handleClick}>Disabled</Button>);
    const button = screen.getByRole('button', { name: /disabled/i });
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });
});
```

## Component Library Documentation

Comprehensive documentation is essential for successful adoption of the component library:

1. **Living Documentation**: Storybook implementation for interactive examples
2. **API Reference**: Detailed documentation of props, methods, and events
3. **Usage Guidelines**: Best practices and patterns for using components
4. **Accessibility Guidelines**: Documentation of accessibility features and considerations
5. **Theme Customization**: Instructions for customizing component appearance

## Conclusion

This UI Component Library provides a comprehensive framework for implementing the VetPMS design system across web and mobile interfaces. By following these standards and guidelines, developers can create a consistent, accessible, and high-quality user experience that supports the specific needs of veterinary practices.