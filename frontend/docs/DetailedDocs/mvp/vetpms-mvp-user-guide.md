# VetPMS MVP User Guide

## Introduction

Welcome to VetPMS, your veterinary practice management system. This guide covers the essential features available in the MVP (Minimum Viable Product) version.

## Getting Started

### Logging In

1. Navigate to VetPMS login page
2. Enter your email and password
3. Click "Login"
4. You'll be directed to your role-specific dashboard

### User Roles

The MVP supports three basic roles:
- **Veterinarian**: Clinical documentation and patient care
- **Receptionist**: Appointment scheduling and client management
- **Admin**: User management and system settings

## Core Features

### Dashboard

The dashboard provides a quick overview of:
- Today's appointments
- Recent patients
- Pending tasks
- Quick action buttons

### Managing Clients

#### Adding a New Client
1. Click "Clients" in the sidebar
2. Click "New Client" button
3. Fill in client information:
   - First Name
   - Last Name
   - Email
   - Phone
   - Address
4. Click "Save"

#### Searching for Clients
1. Go to Clients page
2. Use the search box to find clients by name or phone
3. Click on a client to view details

### Managing Patients

#### Adding a New Patient
1. Open a client record
2. Click "Add Patient"
3. Enter patient information:
   - Name
   - Species
   - Breed
   - Date of Birth
   - Weight
4. Click "Save"

#### Viewing Patient History
1. Open a patient record
2. Medical history is displayed chronologically
3. Click on any record to view details

### Appointment Management

#### Scheduling an Appointment
1. Click "Appointments" in the sidebar
2. Click "New Appointment"
3. Select:
   - Patient (type to search)
   - Veterinarian
   - Date and time
   - Appointment type
4. Add notes if needed
5. Click "Schedule"

#### Managing Daily Schedule
1. Go to Appointments
2. Use the calendar to navigate dates
3. View appointments in day or week view
4. Click on appointments to view details or update status

#### Appointment Statuses
- **Scheduled**: Appointment is booked
- **Checked In**: Client has arrived
- **In Progress**: Consultation ongoing
- **Completed**: Appointment finished
- **Cancelled**: Appointment cancelled

### Medical Records

#### Creating a SOAP Note
1. Open an appointment or patient record
2. Click "New Medical Record"
3. Fill in SOAP fields:
   - **S**ubjective: Client's observations
   - **O**bjective: Your examination findings
   - **A**ssessment: Diagnosis
   - **P**lan: Treatment plan
4. Add prescriptions as text
5. Click "Save"

#### Viewing Medical Records
1. Open a patient record
2. Click on "Medical History"
3. Records are listed by date
4. Click any record to view full details

### Billing

#### Creating an Invoice
1. Complete an appointment
2. Click "Generate Invoice"
3. Add invoice items:
   - Consultation fee
   - Procedures
   - Medications
4. Review total
5. Click "Create Invoice"

#### Recording Payments
1. Open an invoice
2. Click "Record Payment"
3. Enter payment amount
4. Select payment method
5. Click "Save"

#### Invoice Statuses
- **Draft**: Invoice created but not sent
- **Sent**: Invoice sent to client
- **Paid**: Payment received
- **Overdue**: Payment past due date

## Daily Workflows

### Receptionist Daily Tasks

1. **Morning Setup**
   - Login to VetPMS
   - Review today's appointments
   - Print day schedule if needed

2. **Client Check-in**
   - Find appointment in today's list
   - Click "Check In" when client arrives
   - Update client information if needed

3. **Appointment Booking**
   - Check available time slots
   - Create new appointments
   - Send confirmation emails (automatic)

4. **End of Day**
   - Review tomorrow's appointments
   - Ensure all invoices are processed
   - Log out

### Veterinarian Daily Tasks

1. **Start of Day**
   - Login to VetPMS
   - Review appointment schedule
   - Check patient histories for upcoming appointments

2. **Consultations**
   - Open patient record
   - Review medical history
   - Create SOAP note during/after consultation
   - Add prescriptions

3. **Post-Consultation**
   - Complete appointment
   - Ensure medical record is saved
   - Review and approve invoice

## Tips for Efficient Use

### Keyboard Shortcuts
- `Ctrl + N`: New appointment
- `Ctrl + F`: Search
- `Ctrl + S`: Save current form
- `Esc`: Close modal/dialog

### Search Tips
- Use partial names for quick search
- Search by phone includes partial matches
- Patient search includes species and breed

### Best Practices
1. Complete medical records immediately after consultation
2. Update client contact information during check-in
3. Use consistent naming for appointment types
4. Add detailed notes for complex cases

## Troubleshooting

### Common Issues

#### Cannot Login
- Verify email and password
- Check caps lock
- Clear browser cache
- Contact admin for password reset

#### Appointment Not Showing
- Refresh the page
- Check selected date
- Verify appointment status filter

#### Cannot Save Medical Record
- Ensure all required fields are filled
- Check internet connection
- Try saving as draft first

### Getting Help

For technical support:
- Contact your practice admin
- Email: support@vetpms.example.com
- Include screenshots when reporting issues

## System Limitations (MVP)

The following features are not available in the MVP version:
- Multiple practice locations
- Advanced reporting
- Inventory management
- Lab integrations
- Mobile app
- Client portal
- Automated reminders (basic email only via n8n)

## Data Management

### Backing Up Data
- Automatic daily backups are performed
- Contact admin for data recovery

### Exporting Data
- Basic export available for:
  - Client list (CSV)
  - Appointment list (CSV)
  - Invoice summary (CSV)

## Security Best Practices

1. Never share your login credentials
2. Log out when leaving your workstation
3. Use strong passwords
4. Report suspicious activity to admin
5. Don't save passwords in browsers on shared computers

## Quick Reference

### System Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Stable internet connection
- Screen resolution: 1280x720 minimum

### Supported Browsers
- Google Chrome (recommended)
- Mozilla Firefox
- Microsoft Edge
- Safari

### Important URLs
- Login: https://app.vetpms.com
- Support: https://support.vetpms.com
- Status: https://status.vetpms.com

## Glossary

- **SOAP Note**: Subjective, Objective, Assessment, Plan - standard medical documentation format
- **Check-in**: Process of marking a client as arrived for appointment
- **Invoice**: Bill for services rendered
- **Patient**: Animal receiving care
- **Client**: Pet owner

## Version Information

This guide covers VetPMS MVP Version 1.0
Last updated: May 2025

For updates and new features, check the release notes in the application.
