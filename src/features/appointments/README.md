# Appointment Feature Structure

## Directory Structure

```
src/
├── features/
│   └── appointments/
│       ├── components/
│       │   ├── AppointmentScheduler.tsx      # Main scheduler component
│       │   ├── AppointmentForm.tsx           # Form for creating/editing appointments
│       │   └── __tests__/                    # Component tests
│       ├── hooks/
│       │   └── useAppointments.ts            # Appointment-related hooks
│       ├── types/
│       │   └── appointment.ts                # Appointment-related types
│       └── utils/
│           └── appointmentUtils.ts           # Helper functions
└── pages/
    └── appointments/
        ├── AppointmentsPage.tsx              # Main appointments page
        └── AppointmentDetailsPage.tsx        # Appointment details page
```

## Component Responsibilities

### AppointmentScheduler

- Main calendar/scheduler view
- Handles appointment display and time slot management
- Manages appointment creation, editing, and cancellation
- Handles drag-and-drop functionality (future)
- Manages different views (day/week/month)

### AppointmentForm

- Form for creating new appointments
- Form for editing existing appointments
- Handles form validation
- Manages appointment type selection
- Handles recurring appointment setup

### AppointmentsPage

- Page layout for the scheduler
- Handles navigation and routing
- Manages page-level state
- Integrates with the AppointmentScheduler component

### AppointmentDetailsPage

- Displays detailed appointment information
- Shows appointment history
- Manages appointment status updates
- Handles related actions (print, cancel, etc.)

## Data Flow

1. AppointmentsPage loads and renders AppointmentScheduler
2. AppointmentScheduler manages the calendar view and appointment interactions
3. AppointmentForm is used for both creation and editing
4. AppointmentDetailsPage shows detailed view of a single appointment

## Future Considerations

- Add role-specific views
- Implement appointment conflict detection
- Add appointment reminders
- Create recurring appointment functionality
- Add waitlist feature
- Implement video consultation option
