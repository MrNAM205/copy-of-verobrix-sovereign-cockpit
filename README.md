<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# OmniVeroBrix - The Sovereign Cockpit & Municipal Bond Intelligence Engine

This is a unified cockpit for lawful remedy generation, AI-powered document analysis, and deep municipal bond research. It is designed to provide a comprehensive toolkit for navigating the commercial-legal landscape, grounded in black-letter law and professional, data-driven analysis.

The system is built on a clear philosophy: accountability through paperwork, adherence to lawful process, and a rejection of frivolous or extremist arguments. Please see the **"Guiding Principles"** within the application for a full explanation of the operational framework.

## Core Features

### 🏛️ Sovereign Cockpit

*   **Persona Manager:** Distinguish between the Natural Person (Principal) and the Legal Entity (Agent/Trust) to create a jurisdictional firewall.
*   **JARVIS Document Parser:** An AI-powered engine to analyze legal and financial documents, extracting key data points.
*   **Endorsement Studio:** Cryptographically sign and bundle documents with endorsements or allonges.
*   **Remedy Tracker:** Manage multi-step administrative remedy processes, from conditional acceptance to default.
*   **Lawful Scripts Library:** A collection of verbal templates for asserting rights and navigating processes in court or over the phone.
*   **Document Drafter:** Generate legal documents from a library of templates, including jurisdictional challenges and commercial notices.
*   **Secure Vault:** An archive for all generated instruments, personas, and remedy processes.

### 📊 Municipal Bond Intelligence

*   **Unified Search:** A dedicated dashboard to search for municipal bonds across multiple (placeholder) data sources like EMMA, Fidelity, and Bloomberg.
*   **Intelligence Engine:** A backend service that enriches bond data with:
    *   **CUSIP Prefix Resolution:** Identifies the 6-digit CUSIP prefix from an issuer's name.
    *   **Bond Type Classification:** Automatically categorizes bonds (e.g., Hospital Revenue, GO).
    *   **Era-Based Analysis:** Analyzes bond issuance patterns for any given year.
    *   **State File Number Correlation:** A framework for correlating State File Numbers to CUSIP serial numbers.
*   **FOIA Generator:** A tool to generate Freedom of Information Act (FOIA) requests for tracing the commercial paper associated with a court case.

## Technical Architecture

The application is built with a modern, decoupled architecture:

*   **Frontend:** A React 19 application built with Vite and TypeScript, using Tailwind CSS for styling.
*   **Backend:** A Node.js server using Express and TypeScript, which provides the API for the Bond Intelligence engine.

## Run Locally

**Prerequisites:** Node.js (v18 or higher recommended)

The project now consists of two parts: the frontend application and the backend server. You will need to run them in separate terminals.

### 1. Run the Backend Server

The backend server powers the Bond Intelligence dashboard.

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Start the backend server (runs on http://localhost:3002)
npm start
```

### 2. Run the Frontend Application

The frontend is the main user interface for the Sovereign Cockpit.

```bash
# In a new terminal, from the project root directory

# Install dependencies
npm install

# Set your Gemini API Key
# 1. Rename the '.env.example' file to '.env'
# 2. Open the '.env' file and set the VITE_GEMINI_API_KEY to your key.

# Run the frontend application (runs on http://localhost:3000)
npm run dev
```

Once both servers are running, you can access the application at `http://localhost:3000`.