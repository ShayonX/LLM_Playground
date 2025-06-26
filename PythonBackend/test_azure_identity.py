#!/usr/bin/env python3
"""
Test script to verify Azure Identity integration with Azure OpenAI
"""

from openai import AzureOpenAI
from azure.identity import DefaultAzureCredential, get_bearer_token_provider
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_azure_identity_connection():
    """Test the Azure Identity connection with Azure OpenAI"""
    try:
        # Configuration
        model_name = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME", "o3")
        base_url = os.getenv("AZURE_OPENAI_ENDPOINT", "https://compliancecommsaiendpoint.openai.azure.com/openai/v1/")
        api_version = os.getenv("AZURE_OPENAI_API_VERSION", "preview")
        
        print(f"Model: {model_name}")
        print(f"Base URL: {base_url}")
        print(f"API Version: {api_version}")
        
        # Create token provider
        token_provider = get_bearer_token_provider(
            DefaultAzureCredential(), "https://cognitiveservices.azure.com/.default"
        )
        
        # Initialize client
        client = AzureOpenAI(
            base_url=base_url,
            azure_ad_token_provider=token_provider,
            api_version=api_version
        )
        
        print("✅ Azure OpenAI client initialized successfully with Azure Identity")
        
        # Test a simple completion
        response = client.responses.create(
            model=model_name,
            input=[{"role": "user", "content": "Hello! Please respond with a simple greeting."}]
        )
        
        print("✅ Test completion successful!")
        print("Response:")
        for output in response.output:
            if output.type == "text":
                print(f"  {output.text}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

if __name__ == "__main__":
    print("Testing Azure Identity integration with Azure OpenAI...")
    success = test_azure_identity_connection()
    if success:
        print("\n🎉 All tests passed!")
    else:
        print("\n💥 Tests failed!")
