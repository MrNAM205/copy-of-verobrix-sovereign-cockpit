# Changelog

## [Unreleased] - 2025-12-18

### Security
- **API Key Management**: Replaced hardcoded API key with environment variables using `.env` file to prevent key leakage. The `geminiService.ts` now securely loads the API key using Vite's `import.meta.env`.
- Updated `.gitignore` to include `.env*` files, preventing sensitive API keys from being committed to the repository.

### Added
- **Endorsement Allonge Generator**: Added a new component `EndorsementAllonge.tsx` that allows users to generate endorsement allonges for financial instruments.

### Dependencies
- Added `dotenv` package to manage environment variables.

## [Unreleased] - 2025-12-14

### Tooling
- Integrated ESLint and Prettier to enforce consistent code style and identify potential issues.
- Added `lint` and `format` scripts to `package.json` for running ESLint and Prettier.

### Refactor
- Replaced the custom switch-based routing with `react-router-dom` for a more robust and scalable routing solution.
- Migrated the application's state management from `useState` in the root component to a centralized `Zustand` store for better state management.

### Testing
- Set up a testing framework using Jest and React Testing Library to enable unit and component testing.
- Added a `test` script to `package.json` for running tests.
- Included a sample test for the `Dashboard` component to demonstrate testing practices.

### Added
- **Tactical Playbooks Module**: Implemented `PlaybookNavigator` component for interactive checklist-style guides.
- **Traffic Ticket Playbook**: Added initial playbook data (`data/playbooks.ts`) covering Jurisdiction Challenge, Conditional Acceptance, Tender of Remedy, and Reservation of Rights.
- **Navigation**: Added 'Tactical Playbooks' to the application sidebar.
- **Types**: Extended `types.ts` with `Playbook` and `PlaybookStep` interfaces.