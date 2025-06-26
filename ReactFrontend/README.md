# Compliance Communications Frontend

A standalone React frontend for the Compliance Communications application. This project is designed to work independently with the Python backend.

## Prerequisites

-   Node.js (version 18 or higher)
-   npm or yarn

## Installation

1. Install dependencies:

```bash
npm install
```

## Development

1. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## API Integration

This frontend is configured to work with the Python backend running on `http://localhost:8001`. The Vite development server includes a proxy configuration that forwards API requests to the backend.

### Backend Integration

Make sure the Python backend is running on port 8001:

```bash
cd ../PythonBackend
python main.py
```

## Available Scripts

-   `npm run dev` - Start the development server
-   `npm run build` - Build the project for production
-   `npm run preview` - Preview the production build
-   `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── breadcrumbs/    # Breadcrumb navigation
│   ├── chat/           # Chat interface components
│   ├── header/         # Header component
│   └── leftNav/        # Left navigation component
├── pages/              # Page components
│   ├── Copilot/        # Copilot chat page
│   ├── Home/           # Home dashboard
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── store.ts            # Redux store configuration
```

## Features

-   Modern React 18 with TypeScript
-   Fluent UI components for Microsoft 365 styling
-   Redux Toolkit for state management
-   React Router for navigation
-   Vite for fast development and building

## Testing Independently

This frontend can be tested independently of the .NET backend by:

1. Starting the Python backend on port 8001
2. Running this React app on port 5173
3. The proxy configuration will route API calls to the Python backend

Both applications can be developed and tested separately without dependencies on the full .NET solution.
