# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Package Manager:** pnpm (faster alternative to npm/yarn)

**Common Commands:**
- `pnpm install` - Install dependencies
- `pnpm run dev` - Start development server (localhost:5173)
- `pnpm run build` - Build for production (runs `tsc -b && vite build`)
- `pnpm run preview` - Preview production build
- `pnpm run lint` - Run ESLint

**Test Commands:**
- `pnpm test` - Run tests with Vitest
- `pnpm test:ui` - Open Vitest UI
- `pnpm test:coverage` - Run tests with coverage report

## Architecture Overview

This is a **frontend-only team expense tracking application** built with React + TypeScript. All data persists in browser localStorage with no backend required.

### Key Technologies
- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite with path aliases (`@/` → `src/`)
- **UI:** Tailwind CSS v4 + shadcn/ui style components
- **State Management:** Zustand (lightweight stores)
- **Routing:** React Router v6
- **Charts:** Recharts
- **Date Handling:** date-fns
- **Icons:** lucide-react

### Core Data Models
The application manages four main data types:
1. **Projects:** Contain members, have status (active/completed)
2. **Members:** Team members with avatars (emoji)
3. **Categories:** Expense categories with icons and colors
4. **Expenses:** Bills with amount, category, payer, participants, date

### State Management Pattern
Each data type has its own Zustand store in `src/stores/`:
- `useProjectStore.ts` - Project state
- `useExpenseStore.ts` - Expense state
- `useMemberStore.ts` - Member state
- `useCategoryStore.ts` - Category state

Stores follow a consistent pattern: `create<T>Store` with actions for CRUD operations and localStorage persistence via `src/utils/storage.ts`.

### Smart Settlement Algorithm
The key algorithm is in `src/utils/settlement.ts` - a greedy algorithm that minimizes transfer count:
1. Calculates each member's net balance (paid - owed)
2. Groups into creditors (positive) and debtors (negative)
3. Greedily matches largest creditor with largest debtor
4. O(n log n) time complexity

### Component Structure
- `src/components/ui/` - shadcn/ui style base components (Button, Card, Input, etc.)
- `src/components/layout/` - Layout components
- `src/components/{domain}/` - Domain-specific components (expenses, members, projects, etc.)
- `src/pages/` - Page components (routes)
- Use `cn()` utility from `src/lib/utils.ts` for Tailwind class merging

### Routing Structure
Routes are defined in `src/App.tsx` with nested routes for project details:
- `/` - Home page with project list
- `/projects/:projectId` - Project detail (with nested routes)
- `/projects/:projectId/expenses` - Expense management
- `/projects/:projectId/statistics` - Statistics with charts
- `/projects/:projectId/settlement` - Smart settlement
- `/members` - Member management
- `/categories` - Category management

### Data Persistence
- All data stored in browser localStorage via `src/utils/storage.ts`
- No backend API - this is a pure frontend application
- Seed data initialized on first run from `src/data/seed.ts`
- **Important:** Clearing browser data will lose all application data

### Development Notes
1. **Type Safety:** Comprehensive TypeScript types in `src/types/`
2. **Chinese Language:** UI text is in Chinese by default
3. **Currency:** RMB (¥) used throughout
4. **Responsive Design:** Works on desktop and mobile
5. **Component Creation:** Follow shadcn/ui patterns for new components
6. **State Updates:** Use Zustand stores following existing patterns
7. **Styling:** Use Tailwind utility classes with `cn()` helper

### Configuration Files
- `vite.config.ts` - Vite config with path aliases
- `tailwind.config.js` - Tailwind CSS config
- `components.json` - shadcn/ui component config
- `eslint.config.js` - ESLint config (TypeScript + React)
- `tsconfig.json` - TypeScript config with project references
- `vitest.config.ts` - Vitest test config (extends Vite config)

### Testing Architecture
The project uses **Vitest** for testing with **jsdom** environment.

**Test Structure:**
- `src/utils/*.test.ts` - Utility function tests (settlement, statistics)
- `src/stores/__tests__/*.test.ts` - Zustand store tests
- `src/test/setup.ts` - Global test setup

**Test Patterns:**
1. **Utility Tests**: Test pure functions with various input scenarios
2. **Store Tests**: Mock localStorage and test Zustand store actions
3. **Mocking**: Use `vi.mock()` for external dependencies like localStorage

**Key Test Files:**
- `src/utils/settlement.test.ts` - Tests for the smart settlement algorithm
- `src/utils/statistics.test.ts` - Tests for statistics calculations
- `src/stores/__tests__/useProjectStore.test.ts` - Example store test

**Running Tests:**
- All tests are configured to run with `pnpm test`
- Coverage reports available via `pnpm test:coverage`
- UI mode available via `pnpm test:ui`

### Key Files for Understanding
- `src/App.tsx` - Main app with routing
- `src/stores/index.ts` - Store exports
- `src/utils/settlement.ts` - Core settlement algorithm
- `src/utils/statistics.ts` - Statistics calculations
- `src/data/seed.ts` - Initial data structure