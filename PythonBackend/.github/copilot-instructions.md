<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Compliance Communications Python Backend

This is a Python FastAPI backend project for compliance communications with OpenAI integration.

## Project Guidelines

-   Use FastAPI for REST API endpoints
-   Follow async/await patterns for API handlers
-   Use Pydantic models for request/response validation
-   Implement proper error handling and logging
-   Use environment variables for configuration
-   Follow Python naming conventions (snake_case)
-   Include type hints for all functions
-   Use proper HTTP status codes
-   Implement CORS for frontend integration

## Key Components

-   **FastAPI**: Web framework for building APIs
-   **OpenAI**: AI chat completion integration
-   **Pydantic**: Data validation and serialization
-   **Uvicorn**: ASGI server for running the application
-   **python-dotenv**: Environment variable management

## API Endpoints

-   `/api/chat`: Chat completion endpoint
-   `/api/chat/stream`: Streaming chat completion
-   `/health`: Health check endpoint

## Environment Variables

Configure these in `.env`:

-   `OPENAI_API_KEY`: OpenAI API key
-   `AZURE_OPENAI_API_KEY`: Azure OpenAI key (optional)
-   `AZURE_OPENAI_ENDPOINT`: Azure OpenAI endpoint (optional)
-   `AZURE_OPENAI_DEPLOYMENT_NAME`: Azure deployment name (optional)
