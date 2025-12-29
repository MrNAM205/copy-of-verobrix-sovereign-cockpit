# Changelog

## [Unreleased] - 2025-12-29

### Orchestration Refactor - Phase 5 Complete
- **Mission Framework:** Implemented the "Mission" layer, allowing for multi-stage, multi-remedy operations to be defined and executed as a single, cohesive workflow.
- **Mission Data Schema:** Defined a new schema in `types.ts` for `MissionPlaybook` and `ActiveMission`, replacing the old `Playbook` structure. The Zustand store was updated to manage the state of active missions.
- **Playbook Library:** Created a `data/playbooks.ts` library with the first `MissionPlaybook` definitions, such as a "FOIA Records Acquisition" mission that chains the initial request and appeal remedies together. Remedies in `data/remedies.ts` were refactored to be more modular for this purpose.
- **Mission Dashboard UI:** Refactored the main `Dashboard.tsx` component into a "Mission Dashboard," which now serves as the command center for launching new missions from the playbook library and tracking the progress of active ones.
- **Mission Orchestrator (Autopilot):** Built and integrated the `useMissionOrchestrator` hook. This background engine functions as the cockpit's "autopilot," automatically advancing missions by starting the correct remedy based on the playbook's transition logic and the outcome of the previously completed remedy.
- **Predictive Intelligence:** Implemented a new `PredictiveAnalysis` component and integrated it into the dashboard. This feature uses the Gemini Pro model to provide strategic analysis on active missions, predicting likely counter-moves and identifying potential risks.

### Intelligence Refactor - Phase 4 Complete
- **Document Intelligence Engine (DIE):** Implemented the "Jarvis" AI engine for document analysis, transforming the application into an intelligent, predictive system.
- **Intelligence Data Schema:** Defined a new `IntelligenceReport` schema in `types.ts` to structure the AI's output, including document classification, violation detection, deadline extraction, and remedy recommendations.
- **Advanced Prompt Engineering:** Created a new `lib/intelligence.ts` library containing a master prompt for the Gemini API. This prompt is engineered to force the LLM to return a structured JSON object that conforms to the `IntelligenceReport` type, and includes a detailed matrix for detecting violations of FDCPA, FCRA, RESPA, and more.
- **Revamped Jarvis UI:** Completely refactored the `Jarvis.tsx` component into a full-featured "Intelligence Panel." The UI now supports file/text input and displays the structured analysis in a user-friendly format, with dedicated cards for classification, violations, deadlines, and recommendations, replacing the previous raw JSON dump.
- **Generic AI Service:** Refactored the `jarvisExtract` function in `geminiService.ts` to be more flexible, accepting a dynamically constructed prompt, which allows any part of the application to leverage the core intelligence engine.
- **Integration with Remedy Engine:** The Jarvis UI now provides an "Initiate Remedy" button when a remedy is recommended. This button navigates the user to the `RemedyTracker` and uses URL query parameters to automatically trigger the initiation process for the specific, context-appropriate remedy.

### Tactical Refactor - Phase 3 Complete
- **Remedy Engine Core:** Implemented the foundational architecture for the Remedy Engine, transforming the application into a process-driven remedy execution system.
- **Remedy Data Schema:** Defined a comprehensive and universal schema for all remedies in `types.ts` with `RemedyDefinition`, `RemedyStep`, and `ActiveRemedy`, replacing the legacy `RemedyProcess`. The Zustand store has been updated to use this new schema.
- **Core Five Remedies:** Created the data models for the five foundational remedies in `data/remedies.ts`: FOIA Request, FDCPA Debt Validation, FCRA Credit Dispute, RESPA QWR, and Property Tax Appeal.
- **Remedy Navigator UI:** Completely refactored the `RemedyTracker.tsx` component into a `Remedy Navigator`, which now allows users to browse the library of available remedies and view their active, in-process remedies.
- **Interactive Remedy Manager:** Added a new `RemedyManager.tsx` component, accessible via the `/remedy/:instanceId` route. This component provides a detailed, step-by-step interactive view for managing an active remedy, with UI that changes based on the required action for the current step.
- **Timeline Engine:** Implemented a `useTimelineEngine` custom hook that runs in the background to track deadlines for all active remedies. The engine automatically detects missed deadlines and escalates the remedy process to the defined failure step (e.g., for constructive denials).

## [Unreleased] - 2025-12-28

### Strategic Refactor - Phase 2 Complete
- **Persona & Capacity Engine:** Implemented the core architecture for the Persona Engine and Capacity system, making the application identity-aware.
- **Formalized Data Structures:** Defined and implemented the data models for `LegalCapacity`, `SignatureMode`, `JurisdictionalContext`, and `CapacityState` in `types.ts`.
- **Central State Management:** The central Zustand store (`lib/store.ts`) now manages the active persona and the user's current capacity state (capacity, signature mode, jurisdiction), providing a global API for all components.
- **Capacity Selector UI:** Created a new `CapacitySelector.tsx` component and added it to the main dashboard, allowing users to dynamically change their operational capacity.
- **Persona-Aware Document Generation:** Refactored the `Drafter.tsx` component to be fully persona-aware. It now dynamically generates document preambles and signature blocks based on the selected persona and capacity.
- **Global Status Display:** Updated the main application header to display the currently active persona and legal capacity, providing at-a-glance situational awareness.

### Strategic Refactor - Phase 1 Complete
- **Pivoted Legal Framework:** Executed a major strategic pivot away from "sovereign citizen" legal theories toward a more defensible and effective framework grounded in established administrative and consumer protection law.
- **New Core Concept:** Replaced the "Strawman" theory with the "Legal Personhood Architecture." This reframes the core distinction as one of managing legal capacity (Individual vs. Representative) rather than denying jurisdiction.
- **Updated Legal Corpus:** Overhauled `data/corpus.ts` to remove easily dismissed theories and replaced them with foundational, legally-sound concepts based on agency law, trust law, and corporate personhood.
- **New Legal Modules:** Added placeholder files for future development of modules based on real-world enforceable laws: FDCPA, FCRA, TILA, RESPA, and the APA.
- **UI & Terminology Overhaul:**
    - Refactored `PersonaManager.tsx` to use the new terminology of "Individual Capacity" and "Statutory Persona."
    - Refactored `StatusSelector.tsx` to explain legal standing in terms of strategic, defensible capacities.
    - Updated the `GuidingPrinciplesModal.tsx` to reflect the new mission of strategic, pragmatic navigation of the legal system, while rejecting ineffective theoretical arguments.

### Fixed
- **Topic Explorer**: Fixed a runtime error in `TopicExplorer.tsx` caused by an incorrect import. The component was trying to import `MOCK_CORPUS`, but the correct export from `data/corpus.ts` is `CORPUS`. The import and usage have been corrected.
- **Knowledge View**: Fixed a runtime error in `KnowledgeView.tsx` caused by an incorrect import. The component was trying to import `MOCK_CORPUS`, but the correct export from `data/corpus.ts` is `CORPUS`. The import and all usages have been corrected.
- **Script Viewer**: Fixed a runtime error in `ScriptViewer.tsx` caused by an incorrect import. The component was trying to import `MOCK_CORPUS`, but the correct export from `data/corpus.ts` is `CORPUS`. The import and usage have been corrected.

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