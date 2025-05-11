# VetPMS - Veterinary Practice Management System

A modern web application for managing veterinary practices, built with React, TypeScript, and Vite.

## Features

- Patient management
- Appointment scheduling
- Medical records
- Billing and invoicing
- Analytics and reporting
- Multi-language support (Dutch/English)

## Development

### Prerequisites

- Node.js 20 or higher
- npm 10 or higher

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/VetPMS.git
cd VetPMS
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

### Testing

Run the test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Generate test coverage report:

```bash
npm run test:coverage
```

## Deployment

The application is automatically deployed to GitHub Pages when changes are pushed to the main branch. The deployment process:

1. Builds the application
2. Runs all tests
3. Deploys to GitHub Pages

You can also manually trigger a deployment from the GitHub Actions tab.

### Manual Deployment

To manually deploy the application:

1. Build the application:

```bash
npm run build
```

2. Preview the build:

```bash
npm run preview
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Overview

VetPMS is a modern web-based Practice Management System designed specifically for veterinary clinics and hospitals. Built with React, TypeScript, and Tailwind CSS, it offers a comprehensive solution for managing appointments, patient records, billing, inventory, and clinic operations.

## Key Features

- **Role-Based Interface**: Tailored experiences for veterinarians, receptionists, practice managers, nurses, and administrators
- **Modern UI**: Clean, intuitive interface built with shadcn/ui components
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Context-Aware Navigation**: Dynamic navigation based on user role and permissions
- **Dashboard Analytics**: Role-specific metrics and KPIs
- **Theme Support**: Light and dark mode

## Quick Start

Access the application at http://localhost:5173

## Environment Setup

Create a `.env` file in the project root with the following variables:

```
VITE_API_BASE_URL=http://localhost:8000
VITE_AUTH_ENABLED=true
```

## Demo Access

Test credentials for the demo environment:

- **Email**: demo@vetpms.com
- **Password**: password123

## Documentation

- [Project Handoff Documentation](./docs/HANDOFF.md) - Comprehensive guide for new team members
- [User Guide](./docs/USER_GUIDE.md) - Guide for end users
- [API Documentation](./docs/API.md) - API endpoints and usage

## Directory Structure
