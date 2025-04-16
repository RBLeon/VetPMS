# VetPMS (Veterinary Practice Management System)

## Project Overview
VetPMS is a comprehensive practice management system designed specifically for veterinary clinics and hospitals. The system provides a role-optimized user experience that dynamically adapts based on user roles (veterinarians, receptionists, practice managers, paravets), presenting relevant information and workflows without traditional navigation constraints.

## Key Features
- **Role-Based UI**: Interface adapts to the user's role, showing relevant information and actions
- **Context-Aware Navigation**: Modern navigation system that changes based on user context
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Theme Support**: Built-in light and dark mode
- **Integrated Search**: Quick access to clients, patients, appointments, and more

## Technology Stack
- **Frontend Framework**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: Context API
- **Routing**: React Router v6
- **Animation**: Framer Motion
- **Build Tool**: Vite

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- pnpm (v7 or higher)

### Installation Steps
1. Clone the repository
```bash
git clone https://github.com/RBLeon/VetPMS.git
cd VetPMS
```

2. Install dependencies
```bash
pnpm install
```

3. Start the development server
```bash
pnpm run dev
```

4. Build for production
```bash
pnpm run build
```

## Demo Access
You can access the demo with the following credentials:
- **Username**: demo
- **Password**: demo

## Using VetPMS

### Role Selection
After logging in, you'll be prompted to select a role that determines your access level and UI experience:
- **Veterinarian**: Full clinical access with focus on patient care
- **Receptionist**: Focus on appointment scheduling and client management
- **Practice Manager**: Administrative features and reporting
- **Paravet/Nurse**: Clinical support features

### Navigation
VetPMS features a modern, context-aware navigation system:
- **Main Navigation**: Access via the menu button in the bottom right
- **Quick Actions**: Floating action button for common tasks based on your role
- **Search**: Global search available in the header

### Key Workflows
1. **Appointment Management**: Schedule, reschedule, and manage appointments
2. **Patient Records**: Access and update patient medical histories
3. **Client Management**: Manage client information and communications
4. **Inventory**: Track medications and supplies (role-dependent)
5. **Reporting**: Access financial and operational reports (role-dependent)

## Project Structure
- `/src` - Source code
  - `/components` - UI components
  - `/features` - Feature-specific components
  - `/lib` - Utilities, contexts, and configuration
  - `/pages` - Page components
  - `/styles` - Global styles

## License
All rights reserved. This codebase is proprietary and not for public use without permission.

## Contact
For support or inquiries, please contact the development team.
