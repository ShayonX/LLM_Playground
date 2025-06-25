# 🤖 LLM Playground - Open Source AI Agent UX Playground

An **open-source playground** for developers to connect their AI agents with a beautiful, professional UX. This project provides a complete full-stack solution featuring **MORGAN** - a sophisticated AI copilot with an enterprise-grade React frontend and a powerful Python FastAPI backend.

> **🎯 Main Intent**: This repository serves as an **open-source playground** for developers to experiment with AI agent integrations, providing a solid foundation with modern UX patterns that can be adapted for any AI agent use case.

## 🚨 **IMPORTANT: Bring Your Own Model (BYOM)**

**This is a BYOM application - you must provide your own AI infrastructure:**

-   **Azure OpenAI resource** OR **Azure AI Foundry workspace**
-   **Deployed AI model** (e.g., o3, gpt-4o, gpt-4-turbo)
-   **Azure authentication** (Azure CLI, Service Principal, or Managed Identity)

📋 **Quick Setup**: Copy `PythonBackend_ComplianceCommsAgent/.env.example` to `.env` and configure your endpoints. See the [Backend Setup Guide](PythonBackend_ComplianceCommsAgent/README.md) for detailed instructions.

---

## 🌟 **What This Project Offers**

### 🔧 **For Developers**

-   **🚀 Ready-to-use AI agent framework** with enterprise UX patterns
-   **🔌 Pluggable architecture** - easily adapt for your own AI models and functions
-   **💡 Modern React frontend** with professional chat interface, voice integration, and file uploads
-   **⚡ FastAPI backend** with streaming responses and Chain-of-Thought reasoning
-   **🛠️ Complete development workflow** with automated setup scripts

### 🎭 **Demo Persona: MORGAN**

The included demo showcases **MORGAN** (Migration Orchestration Resource Generation Automation Navigation), a compliance communications assistant with:

-   **30+ enterprise functions** (HR, finance, compliance, IT operations)
-   **Chain-of-Thought reasoning** with streaming responses
-   **Document processing** (PDF upload and analysis)
-   **Voice interaction** (speech-to-text, text-to-speech)
-   **Email integration** and notification systems

---

## 🏗️ **Architecture Overview**

### **Frontend** (`ReactFrontend/`)

-   **React 18** with TypeScript and Vite
-   **Fluent UI** components for Microsoft 365-style interface
-   **Redux Toolkit** for state management
-   **Real-time streaming** chat with Chain-of-Thought visualization
-   **Voice integration** with browser Speech APIs
-   **File upload** support with PDF processing
-   **Responsive design** with mobile support

### **Backend** (`PythonBackend_ComplianceCommsAgent/`)

-   **FastAPI** with async/await patterns
-   **Azure OpenAI** integration with o3 model support
-   **Streaming responses** with Server-Sent Events (SSE)
-   **Chain-of-Thought** reasoning with enhanced visualization
-   **Function calling** with 30+ demo enterprise functions
-   **PDF processing** with PyPDF2
-   **Email integration** capabilities

---

## 🚀 **Quick Start (Windows)**

### **Prerequisites**

-   **Node.js 18+** with npm
-   **Python 3.8+**
-   **Git**

### **1. Automated Setup**

```powershell
# Clone the repository
git clone <repository-url>
cd LLM_Playground

# Run automated setup (installs all dependencies)
.\test-setup.ps1
```

### **2. Verify Setup**

```powershell
# Verify installation and project structure
.\verify-setup.ps1
```

### **3. Start Development Environment**

```powershell
# Option A: Interactive startup script
.\start-dev.ps1

# Option B: Manual startup (requires 2 terminals)
# Terminal 1 - Start Python backend:
cd PythonBackend_ComplianceCommsAgent
python main.py

# Terminal 2 - Start React frontend:
cd ReactFrontend
npm run dev
```

### **4. Access the Application**

-   **Frontend**: http://localhost:5173
-   **Backend API**: http://localhost:8001
-   **API Documentation**: http://localhost:8001/docs

---

## 📁 **Project Structure**

```
LLM_Playground/
├── 📜 README.md                    # This file
├── 🔧 test-setup.ps1              # Automated dependency installation
├── 🚀 start-dev.ps1               # Development server startup
├── ✅ verify-setup.ps1             # Setup verification
│
├── 🎨 ReactFrontend/               # Modern React frontend
│   ├── src/
│   │   ├── components/             # Reusable UI components
│   │   │   ├── chat/              # Chat interface with bubbles
│   │   │   ├── header/            # App header with voice toggle
│   │   │   └── leftNav/           # Navigation sidebar
│   │   ├── pages/
│   │   │   ├── Copilot/           # Main chat interface
│   │   │   └── Home/              # Dashboard (extensible)
│   │   ├── config/                # API configuration
│   │   └── store.ts               # Redux state management
│   ├── package.json
│   └── vite.config.js
│
└── 🐍 PythonBackend_ComplianceCommsAgent/  # FastAPI backend
    ├── main.py                    # FastAPI application with all endpoints
    ├── functions.py               # 30+ demo enterprise functions
    ├── sendEmail.py               # Email integration utilities
    ├── requirements.txt           # Python dependencies
    └── test_*.py                  # API testing scripts
```

---

## 🛠️ **PowerShell Scripts (Windows)**

### **`test-setup.ps1`** - Automated Setup

-   ✅ Checks prerequisites (Node.js, Python)
-   📦 Installs React frontend dependencies (`npm install`)
-   🐍 Creates Python virtual environment
-   📚 Installs Python backend dependencies (`pip install -r requirements.txt`)
-   🎉 Provides next steps instructions

### **`start-dev.ps1`** - Development Startup

-   🎛️ Interactive menu for startup options:
    1. **Both services** (backend first, instructions for frontend)
    2. **Backend only** (Python FastAPI server)
    3. **Frontend only** (React development server)
-   🔄 Handles virtual environment activation
-   📍 Provides access URLs and next steps

### **`verify-setup.ps1`** - Setup Verification

-   🔍 Validates project structure
-   ✅ Checks dependency installation
-   🧪 Tests React build process
-   🐍 Verifies Python dependencies
-   📊 Provides comprehensive status report

---

## 🔥 **Key Features Showcase**

### **💬 Advanced Chat Interface**

-   **Streaming responses** with real-time typing indicators
-   **Chain-of-Thought visualization** with orange reasoning bubbles
-   **Voice interaction** - speak your questions, hear responses
-   **File upload** with PDF document analysis
-   **Message history** with Redux state management

### **🧠 Chain-of-Thought Reasoning**

-   **Enhanced streaming** with separate reasoning and content phases
-   **Visual indicators** for thinking vs. responding
-   **Function call tracking** with real-time execution status
-   **Detailed event logging** for debugging and monitoring

### **📄 Document Processing**

-   **PDF upload** with text extraction
-   **Document analysis** integrated with AI reasoning
-   **File management** with upload status and removal
-   **Content integration** with chat context

### **🎤 Voice Integration**

-   **Speech-to-text** for hands-free input
-   **Text-to-speech** with browser-optimized voices
-   **Markdown stripping** for clean audio output
-   **Cross-browser compatibility** with fallback handling

---

## 🔌 **Customizing for Your Agent**

### **Backend Customization**

1. **Replace functions.py** with your own agent capabilities
2. **Update SYSTEM_PROMPTS** in main.py with your agent's personality
3. **Modify Azure OpenAI configuration** for your deployment
4. **Add your API integrations** in place of demo functions

### **Frontend Customization**

1. **Update branding** in Header.tsx and assets
2. **Modify chat prompts** and welcome messages
3. **Customize UI components** with your design system
4. **Add domain-specific features** to the interface

### **Environment Configuration**

```bash
# Backend (.env in PythonBackend_ComplianceCommsAgent/)
AZURE_OPENAI_ENDPOINT=your_endpoint
AZURE_OPENAI_API_KEY=your_key
AZURE_OPENAI_API_VERSION=your_version

# Frontend (.env in ReactFrontend/)
VITE_API_BASE_URL=http://localhost:8001
```

---

## 🧪 **Testing & Development**

### **API Testing**

```bash
# Test backend health
curl http://localhost:8001/health

# Test chat endpoint
curl -X POST http://localhost:8001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello MORGAN", "scenario": "default"}'

# Test Chain-of-Thought streaming
curl http://localhost:8001/chat/cot-stream \
  -H "Accept: text/event-stream"
```

### **Available Test Scripts**

-   **`test_api.py`** - Basic API endpoint testing
-   **`test_cot_streaming.py`** - Chain-of-Thought streaming tests
-   **`test_cot_upload.py`** - Document upload with reasoning
-   **`test_email_functions.py`** - Email integration testing

---

## 🌐 **API Endpoints**

### **Core Chat Endpoints**

-   **`POST /api/chat`** - Standard chat completion
-   **`POST /api/chat/stream`** - Streaming chat with function calls
-   **`POST /chat/cot-stream`** - Enhanced Chain-of-Thought streaming
-   **`POST /chat/upload-cot-stream`** - Document upload with reasoning

### **Utility Endpoints**

-   **`GET /health`** - Service health check
-   **`GET /api/cot/info`** - Chain-of-Thought capabilities info
-   **`GET /api/user/{user_id}`** - User information retrieval

### **Function Endpoints**

30+ enterprise function endpoints for demo purposes (see `functions.py`)

---

## 🤝 **Contributing & Extending**

### **Adding New Agent Functions**

1. Add function to `functions.py`
2. Update `get_all_tools()` in `main.py`
3. Add function mapping in `call_function()`
4. Test with included test scripts

### **Frontend Extensions**

1. Add new pages in `src/pages/`
2. Create reusable components in `src/components/`
3. Update navigation in `leftNav/LeftNav.tsx`
4. Extend Redux store for new state

### **Development Workflow**

1. **Fork** the repository
2. **Create feature branch** from main
3. **Test locally** with provided scripts
4. **Submit pull request** with description

---

## 📚 **Tech Stack & Dependencies**

### **Frontend**

-   **React 18** - Modern React with hooks
-   **TypeScript** - Type-safe development
-   **Vite** - Fast build tool and dev server
-   **Fluent UI** - Microsoft design system
-   **Redux Toolkit** - State management
-   **React Router** - Navigation

### **Backend**

-   **FastAPI** - Modern Python web framework
-   **Azure OpenAI** - AI model integration
-   **Pydantic** - Data validation
-   **Uvicorn** - ASGI server
-   **PyPDF2** - PDF processing
-   **Python-multipart** - File upload handling

---

## 🔗 **Additional Resources**

-   **[FastAPI Documentation](https://fastapi.tiangolo.com/)**
-   **[React Documentation](https://reactjs.org/docs)**
-   **[Fluent UI Components](https://developer.microsoft.com/en-us/fluentui)**
-   **[Azure OpenAI Service](https://azure.microsoft.com/products/ai-services/openai-service)**
-   **[Chain-of-Thought Prompting](https://arxiv.org/abs/2201.11903)**

---

## 📄 **License**

This project is open source and available under the [MIT License](LICENSE).

---

## 🎉 **Get Started Today!**

```powershell
git clone <your-repo-url>
cd LLM_Playground
.\test-setup.ps1
.\start-dev.ps1
```

**Happy coding! 🚀**

_Transform this playground into your next AI agent masterpiece._
