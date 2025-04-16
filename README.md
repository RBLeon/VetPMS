# VetPMS - Veterinary Practice Management System

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

### Prerequisites

- Node.js v18+
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/RBLeon/VetPMS.git
cd VetPMS

# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

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
