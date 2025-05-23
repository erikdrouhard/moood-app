# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Initial setup
npm install

# Development (run in separate terminals)
npm run server    # Start Express API server on port 3001
npm run dev       # Start Vite frontend dev server

# Code quality
npm run lint      # Run ESLint
npm run test      # Run Vitest test suite

# Build
npm run build     # TypeScript compile + Vite production build
npm run preview   # Preview production build

# Run specific tests
npx vitest run -t "test name pattern"
```

## Architecture Overview

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js API with SQLite database
- **UI Framework**: Tailwind CSS + shadcn/ui components
- **State**: Local React state (no global state management)
- **Auth**: JWT-based authentication
- **Data Visualization**: Chart.js + Recharts

### Key Architectural Patterns

1. **Authentication Flow**:
   - JWT tokens stored in localStorage
   - Auth middleware validates tokens on protected API routes
   - Frontend checks auth state and redirects to login when needed

2. **Data Storage**:
   - Server: SQLite database (`data.db`) with users and entries tables
   - Client fallback: localStorage when API is unavailable
   - Mood entries stored as JSON strings in database

3. **Component Structure**:
   - `src/components/ui/` - Base UI components from shadcn/ui (pre-installed)
   - `src/components/auth/` - Authentication components
   - `src/components/` - Feature components (MoodTracker, MoodGraph, etc.)

4. **API Endpoints**:
   - `POST /signup` - User registration
   - `POST /login` - User authentication
   - `GET /entries` - Fetch user's mood entries (protected)
   - `POST /entries` - Save new mood entry (protected)

### Environment Configuration

Create `.env` file:
```env
VITE_API_BASE_URL=http://localhost:3001
```

## Important Notes

- **shadcn/ui Components**: All UI components are already installed in `src/components/ui/`. Cannot add new shadcn/ui components without CLI access.
- **Database**: SQLite database auto-creates on first server run
- **Testing**: Always run `npm run lint` and `npm run test` after changes
- **PR Titles**: Use format `[Area] Description` (e.g., `[Auth] Fix login validation`)