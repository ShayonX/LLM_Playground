// API Configuration
// Configure the base URL for different environments

export const API_CONFIG = {
    // Python Backend (FastAPI)
    PYTHON_BACKEND: 'http://localhost:8001',

    // .NET Backend (for reference)
    DOTNET_BACKEND: 'https://localhost:7109',

    // Current active backend
    ACTIVE_BACKEND: 'PYTHON_BACKEND'
};

export const getApiBaseUrl = () => {
    return API_CONFIG[API_CONFIG.ACTIVE_BACKEND as keyof typeof API_CONFIG];
};

// API Endpoints
export const API_ENDPOINTS = {
    CHAT: '/api/chat',
    CHAT_STREAM: '/api/chat/stream',
    HEALTH: '/health',

    // Legacy .NET endpoints (for reference)
    LEGACY_COPILOT: '/api/v1.0/copilotCommunication',
    LEGACY_MIGRATIONS_ALL: '/api/v1.0/native/getall',
    LEGACY_MIGRATIONS_BY_NAME: '/api/v1.0/native/getbydisplayname'
};

export default API_CONFIG;
