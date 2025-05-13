# VetPMS Tasks

## Current Tasks

### High Priority

- [x] Add comprehensive dummy data for all role-specific dashboards
- [ ] Enhance Appointment Scheduler

  - [x] Add click functionality to appointments (nu via popup/venster met details en bewerken, getest, build geslaagd)
  - [x] Modal ondersteunt zowel bekijken als bewerken van afspraakgegevens
  - [x] Implement appointment editing modal
  - [x] Add ability to create new appointments by clicking empty slots
  - [x] Add appointment cancellation functionality
  - [ ] Enable drag-and-drop functionality for appointments
  - [ ] Create role-specific views (all staff vs personal schedule as an example, think of more specific things per role)
  - [ ] Add view switching options (day/week/month)
  - [ ] Implement appointment status indicators
  - [ ] Add appointment type filtering
  - [ ] Create appointment conflict detection

- [ ] Connect Dashboard Actions

  - [x] Connect all buttons on the dashboard to the correct pages
  - [x] Connect all tiles under the tabs to the right page
  - [x] Link "New Appointment" buttons to scheduler
  - [x] Connect "View Patient" buttons to patient details
  - [ ] Link "Start Consult" to medical records creation
  - [ ] Connect notification badges to notification center
  - [ ] Link financial overview to detailed reports
  - [ ] Connect quick action buttons to respective forms
  - [ ] Implement search functionality across all dashboards

- [ ] Complete Client/Patient Management

  - [ ] Finish patient registration flow
  - [ ] Implement client profile editing
  - [ ] Add patient history view
  - [ ] Create vaccination record management
  - [ ] Enable document upload/management
  - [ ] Implement prescription management
  - [ ] Add billing/payment processing
  - [ ] Create client communication log

- [ ] Implement End-to-End Workflows

  - [ ] Staff Appointment Processing

    - [ ] Create notification system for new appointments
    - [ ] Add appointment approval workflow
    - [ ] Implement staff assignment
    - [ ] Enable schedule conflict resolution

  - [ ] Consultation Flow

    - [ ] Create pre-consultation checklist
    - [ ] Implement consultation notes template
    - [ ] Add diagnosis/treatment planning
    - [ ] Enable prescription generation
    - [ ] Create follow-up scheduling
    - [ ] Implement billing integration

  - [ ] Medical Records Flow
    - [ ] Create SOAP note templates
    - [ ] Enable image/file attachments
    - [ ] Add lab results integration
    - [ ] Implement treatment plan tracking
    - [ ] Create referral management

- [ ] If you can think of more flows that are very important for daily operations then note them

- [ ] Implement status filter for Medical Records System
- [ ] Implement type filter for Medical Records System
- [ ] Add status updates for Medical Records
- [ ] Implement notification system

### Medium Priority

- [ ] Review and improve navigation patterns
- [ ] Add loading states
- [ ] Implement proper error messages
- [ ] Add success notifications
- [ ] Improve responsive design

### Low Priority (skip for now)

- [ ] Set up database schema
- [ ] Implement API endpoints
- [ ] Create data models
- [ ] Set up authentication middleware
- [ ] Implement role-based access control
- [ ] Create data validation
- [ ] Set up error handling
- [ ] Implement logging system

- [ ] Implement End-to-End Workflows
  - [ ] (for later, once we have client portal skip for now) Client Portal Appointment Booking
    - [ ] Create appointment request form
    - [ ] Implement availability checking
    - [ ] Add confirmation notifications
    - [ ] Enable appointment modification/cancellation

## Notes

- All date formats should use the Dutch style (d MMM yyyy)
- Currency should be displayed in euros (€)
- Medical terms should be consistent across the application
- Consider adding tooltips for complex medical terms
- Ensure proper grammar and spelling in all Dutch text
- Maintain consistent terminology across all components
- Each feature should be tested before deployment
- Focus on role-specific functionality and user experience
- Prioritize fixing existing issues before adding new features
