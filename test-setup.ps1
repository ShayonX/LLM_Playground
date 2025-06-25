#!/usr/bin/env pwsh

# Test script for the standalone React frontend with Python backend

Write-Host "🚀 Starting Compliance Communications Test Suite" -ForegroundColor Cyan
Write-Host ""

# Function to check if a command exists
function Test-Command {
    param($Command)
    $null = Get-Command $Command -ErrorAction SilentlyContinue
    return $?
}

# Check prerequisites
Write-Host "🔍 Checking prerequisites..." -ForegroundColor Yellow

if (-not (Test-Command "node")) {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18 or higher." -ForegroundColor Red
    exit 1
}

if (-not (Test-Command "npm")) {
    Write-Host "❌ npm is not installed. Please install npm." -ForegroundColor Red
    exit 1
}

if (-not (Test-Command "python")) {
    Write-Host "❌ Python is not installed. Please install Python 3.8 or higher." -ForegroundColor Red
    exit 1
}

Write-Host "✅ All prerequisites are available" -ForegroundColor Green
Write-Host ""

# Check Node.js version
$nodeVersion = node --version
Write-Host "📦 Node.js version: $nodeVersion" -ForegroundColor Blue

# Check Python version
$pythonVersion = python --version
Write-Host "🐍 Python version: $pythonVersion" -ForegroundColor Blue
Write-Host ""

# Install React frontend dependencies
Write-Host "📥 Installing React frontend dependencies..." -ForegroundColor Yellow
Set-Location "ReactFrontend"

if (-not (Test-Path "node_modules")) {
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install React dependencies" -ForegroundColor Red
        exit 1
    }
}
else {
    Write-Host "✅ Dependencies already installed" -ForegroundColor Green
}

Set-Location ".."

# Install Python backend dependencies
Write-Host "📥 Installing Python backend dependencies..." -ForegroundColor Yellow
Set-Location "PythonBackend"

if (-not (Test-Path ".venv")) {
    Write-Host "Creating Python virtual environment..." -ForegroundColor Blue
    python -m venv .venv
    
    # Activate virtual environment
    if ($IsWindows -or $env:OS -eq "Windows_NT") {
        & ".venv\Scripts\Activate.ps1"
    }
    else {
        & source .venv/bin/activate
    }
}

pip install -r requirements.txt
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install Python dependencies" -ForegroundColor Red
    exit 1
}

Set-Location ".."

Write-Host ""
Write-Host "🎉 Setup completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "To start the applications:" -ForegroundColor Cyan
Write-Host "1. Start Python backend:"
Write-Host "   cd PythonBackend && python main.py"
Write-Host ""
Write-Host "2. Start React frontend (in a new terminal):"
Write-Host "   cd ReactFrontend && npm run dev"
Write-Host ""
Write-Host "3. Open your browser to: http://localhost:5173"
Write-Host ""
Write-Host "💡 The React app will proxy API calls to the Python backend on port 8001"
