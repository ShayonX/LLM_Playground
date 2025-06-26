# Compliance Communications Python Backend

A FastAPI-based backend service for compliance communications with Azure OpenAI integration.

## 🚨 IMPORTANT: Bring Your Own Model (BYOM)

**This application requires you to provide your own Azure OpenAI or Azure AI Foundry endpoint.**

You cannot run this application without:

1. An Azure OpenAI resource OR Azure AI Foundry workspace
2. A deployed model (e.g., o3, gpt-4o, gpt-4-turbo)
3. Proper Azure authentication setup

## Features

-   **FastAPI Framework**: Modern, fast web framework for building APIs
-   **Azure OpenAI Integration**: Chat completion with Azure OpenAI using the latest Responses API
-   **Azure Identity Authentication**: Secure authentication using Azure Identity (no API keys needed)
-   **CORS Support**: Configured for React frontend integration
-   **Streaming Support**: Real-time streaming chat responses with Chain of Thought reasoning
-   **Function Calling**: Built-in tools for compliance data retrieval
-   **PDF Upload Support**: Analyze documents with AI
-   **Environment Configuration**: Flexible configuration via environment variables
-   **Health Monitoring**: Health check endpoints for monitoring

## Quick Start

### Prerequisites

-   Python 3.8+
-   pip package manager
-   **Azure subscription with Azure OpenAI or Azure AI Foundry access**
-   Azure CLI (for authentication)

### Step 1: Azure Setup

1. **Create Azure OpenAI Resource** (Option A):

    ```bash
    # Login to Azure
    az login

    # Create resource group (if needed)
    az group create --name myResourceGroup --location eastus2

    # Create Azure OpenAI resource
    az cognitiveservices account create \
      --name myOpenAI \
      --resource-group myResourceGroup \
      --kind OpenAI \
      --sku s0 \
      --location eastus2
    ```

2. **OR Create Azure AI Foundry Workspace** (Option B):

    - Go to [Azure AI Foundry](https://ai.azure.com)
    - Create a new workspace
    - Deploy a model (e.g., o3, gpt-4o)

3. **Deploy a Model**:
    - In Azure OpenAI Studio or AI Foundry, deploy a model
    - Note your deployment name and endpoint URL

### Step 2: Application Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd PythonBackend_ComplianceCommsAgent
```

2. Create a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. **Configure your environment**:

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your Azure OpenAI details:
# AZURE_OPENAI_ENDPOINT=https://your-resource-name.openai.azure.com/openai/v1/
# AZURE_OPENAI_DEPLOYMENT_NAME=your-model-deployment-name
# AZURE_OPENAI_API_VERSION=preview
```

### Quick Setup (Alternative)

For a guided setup experience:

```bash
python setup.py
```

This script will:

-   Copy `.env.example` to `.env`
-   Open the `.env` file for editing
-   Display next steps

Then continue with Steps 3-5 above.

### Step 3: Authentication Setup

Choose one authentication method:

**Option A: Azure CLI (Recommended for Development)**:

```bash
az login
```

**Option B: Service Principal (For Production)**:

```bash
# Set environment variables
export AZURE_CLIENT_ID="your-client-id"
export AZURE_CLIENT_SECRET="your-client-secret"
export AZURE_TENANT_ID="your-tenant-id"
```

**Option C: Managed Identity** (automatically works when deployed to Azure)

### Step 4: Validate Your Setup

Before running the application, validate your configuration:

```bash
python validate_config.py
```

This script will check:

-   ✅ Environment variables are set correctly
-   ✅ Azure authentication is working
-   ✅ Azure OpenAI endpoint is accessible
-   ✅ Model deployment is responding

### Step 5: Run the Application

AZURE_OPENAI_DEPLOYMENT_NAME=o3
AZURE_OPENAI_API_VERSION=preview

# Fallback to regular OpenAI:

OPENAI_API_KEY=your_openai_api_key_here

````

5. Authenticate with Azure (for Azure Identity):

```bash
az login
````

6. Run the development server:

```bash
python main.py
```

The API will be available at `http://localhost:8001`

7. Test the API:

```bash
python test_api.py
```

## Authentication Methods

### Azure Identity (Recommended)

This backend now supports Azure Identity authentication, which provides secure, keyless authentication to Azure OpenAI. Azure Identity automatically handles authentication using:

1. **Managed Identity** (when running on Azure)
2. **Azure CLI credentials** (when logged in via `az login`)
3. **Visual Studio Code credentials**
4. **Environment variables** (AZURE_CLIENT_ID, AZURE_CLIENT_SECRET, AZURE_TENANT_ID)

Benefits:

-   No API keys to manage
-   Automatic credential rotation
-   Enhanced security
-   Works seamlessly across development and production environments

### API Key Authentication (Fallback)

For development or when Azure Identity is not available, the system falls back to API key authentication.

## Configuration

Create a `.env` file in the project root with the following variables:

```env
# Azure OpenAI with Azure Identity (Recommended)
AZURE_OPENAI_ENDPOINT=https://octo-hackathon-eastus2.openai.azure.com/openai/v1/
AZURE_OPENAI_DEPLOYMENT_NAME=o3
AZURE_OPENAI_API_VERSION=preview

# Fallback OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Legacy Azure OpenAI with API Key (deprecated)
# AZURE_OPENAI_API_KEY=your_azure_openai_key_here
```

## Testing Azure Identity

Run the test script to verify Azure Identity integration:

```bash
python test_azure_identity.py
```

## API Endpoints

### Health Check

-   `GET /` - Basic health check
-   `GET /health` - Detailed health check with OpenAI status

### Chat Completion

-   `POST /api/chat` - Standard chat completion
-   `POST /api/chat/stream` - Streaming chat completion

#### Request Format

```json
{
    "message": "Your message here",
    "scenario": "default",
    "messages": [
        {
            "content": "Previous message",
            "agent": "userAgent"
        }
    ]
}
```

#### Response Format

```json
{
    "response": "AI response here",
    "success": true,
    "error": ""
}
```

## Development

### Running in Development Mode

```bash
# With auto-reload
uvicorn main:app --reload --port 8000
```

### API Documentation

FastAPI automatically generates interactive API documentation:

-   Swagger UI: `http://localhost:8000/docs`
-   ReDoc: `http://localhost:8000/redoc`

## Deployment

### Production Setup

1. Set environment variables in your production environment
2. Use a production ASGI server like Gunicorn:

```bash
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build and run:

```bash
docker build -t compliance-backend .
docker run -p 8000:8000 --env-file .env compliance-backend
```

## Frontend Integration

This backend is designed to work with the React frontend. Update your frontend API calls to point to:

-   Development: `http://localhost:8001/api/chat`
-   Production: `https://your-domain.com/api/chat`

## Scenarios

The API supports different compliance scenarios:

-   `default`: General compliance assistance
-   `policy_review`: Policy analysis and review
-   `training_materials`: Training content creation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

[Your License Here]
