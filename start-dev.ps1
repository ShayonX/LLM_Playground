#!/usr/bin/env pwsh

# Development startup script for both frontend and backend

Write-Host "🚀 Starting Compliance Communications Development Environment" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "ReactFrontend") -or -not (Test-Path "PythonBackend")) {
    Write-Host "❌ Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

# Function to start backend
function Start-Backend {
    Write-Host "🐍 Starting Python backend..." -ForegroundColor Yellow
    Set-Location "PythonBackend"
    
    # Activate virtual environment if it exists
    if (Test-Path ".venv") {
        if ($IsWindows -or $env:OS -eq "Windows_NT") {
            & ".venv\Scripts\Activate.ps1"
        }
    }
    
    # Start the FastAPI server
    python main.py
}

# Function to start frontend
function Start-Frontend {
    Write-Host "⚛️ Starting React frontend..." -ForegroundColor Yellow
    Set-Location "ReactFrontend"
    npm run dev
}

# Ask user what to start
Write-Host "What would you like to start?" -ForegroundColor Cyan
Write-Host "1. Both frontend and backend (recommended)"
Write-Host "2. Backend only"
Write-Host "3. Frontend only"
Write-Host ""

$choice = Read-Host "Enter your choice (1-3)"

switch ($choice) {
    "1" {
        Write-Host "Starting both applications..." -ForegroundColor Green
        Write-Host ""
        Write-Host "⚠️  This will start the backend. You'll need to open a new terminal to start the frontend." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "In the new terminal, run:"
        Write-Host "cd ReactFrontend && npm run dev"
        Write-Host ""
        Start-Backend
    }
    "2" {
        Write-Host "Starting backend only..." -ForegroundColor Green
        Start-Backend
    }
    "3" {
        Write-Host "Starting frontend only..." -ForegroundColor Green
        Write-Host "⚠️  Make sure the Python backend is running on port 8001" -ForegroundColor Yellow
        Start-Frontend
    }
    default {
        Write-Host "Invalid choice. Exiting." -ForegroundColor Red
        exit 1
    }
}
