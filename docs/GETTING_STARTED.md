# Getting Started Guide

## For Developers

### First Time Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/cjhimanshu/hotel-booking-system
   cd hotel-booking-system
   ```

2. **Install dependencies**

   ```bash
   # Install root dependencies (if any)
   npm install

   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Configure environment variables**

   ```bash
   # Copy example env files
   cp server/.env.example server/.env
   # Edit server/.env with your actual values
   ```

4. **Start development servers**

   ```bash
   # Terminal 1 - Backend
   cd server
   npm run dev

   # Terminal 2 - Frontend
   cd client
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000
   - Health check: http://localhost:5000/api/health

## Project Structure Overview

- **client/**: React frontend built with Vite
- **server/**: Express.js backend API
- **docs/**: Documentation files
- **scripts/**: Utility scripts
- **docker-compose.yml**: Container orchestration

## Common Commands

### Backend

- `npm run dev` - Start development server with hot reload
- `npm start` - Start production server

### Frontend

- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Development Workflow

1. Create a new branch for your feature
2. Make your changes following the Code Style Guide
3. Test your changes locally
4. Commit with meaningful messages (use conventional commits)
5. Push to GitHub
6. Create a Pull Request

## Useful Resources

- [API Documentation](./docs/API_DOCUMENTATION.md)
- [Database Schema](./docs/DATABASE_SCHEMA.md)
- [Code Style Guide](./CODE_STYLE_GUIDE.md)
- [Security Guide](./docs/SECURITY_GUIDE.md)
- [Troubleshooting Guide](./docs/TROUBLESHOOTING.md)
