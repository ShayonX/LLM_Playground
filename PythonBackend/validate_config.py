#!/usr/bin/env python3
"""
Configuration Validation Script for BYOM Setup

This script validates that your Azure OpenAI configuration is correct
before running the main application.
"""

import os
import sys
from dotenv import load_dotenv
from azure.identity import DefaultAzureCredential, get_bearer_token_provider
from openai import AzureOpenAI

def validate_config():
    """Validate the BYOM configuration"""
    print("🔍 Validating BYOM Configuration...")
    print("=" * 50)
    
    # Load environment variables
    load_dotenv()
    
    # Check required environment variables
    azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
    model_name = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME")
    api_version = os.getenv("AZURE_OPENAI_API_VERSION", "preview")
    
    print(f"✅ Loaded .env file")
    
    # Validate environment variables
    if not azure_endpoint:
        print("❌ AZURE_OPENAI_ENDPOINT is not set")
        print("   Please set this in your .env file")
        return False
    else:
        print(f"✅ AZURE_OPENAI_ENDPOINT: {azure_endpoint}")
    
    if not model_name:
        print("❌ AZURE_OPENAI_DEPLOYMENT_NAME is not set")
        print("   Please set this in your .env file")
        return False
    else:
        print(f"✅ AZURE_OPENAI_DEPLOYMENT_NAME: {model_name}")
    
    print(f"✅ AZURE_OPENAI_API_VERSION: {api_version}")
    
    # Test Azure authentication
    print("\n🔐 Testing Azure Authentication...")
    try:
        credential = DefaultAzureCredential()
        token_provider = get_bearer_token_provider(
            credential, "https://cognitiveservices.azure.com/.default"
        )
        print("✅ Azure authentication successful")
    except Exception as e:
        print(f"❌ Azure authentication failed: {e}")
        print("   Try running: az login")
        return False
    
    # Test Azure OpenAI connection
    print("\n🌐 Testing Azure OpenAI Connection...")
    try:
        client = AzureOpenAI(
            base_url=azure_endpoint,
            azure_ad_token_provider=token_provider,
            api_version=api_version
        )
        
        # Try a simple completion
        response = client.chat.completions.create(
            model=model_name,
            messages=[{"role": "user", "content": "Hello, this is a test message."}],
            max_tokens=10
        )
        
        print("✅ Azure OpenAI connection successful")
        print(f"   Model response: {response.choices[0].message.content.strip()}")
        
    except Exception as e:
        print(f"❌ Azure OpenAI connection failed: {e}")
        print("   Check your endpoint URL and model deployment name")
        return False
    
    print("\n🎉 All validations passed! Your BYOM setup is ready.")
    return True

if __name__ == "__main__":
    if not os.path.exists(".env"):
        print("❌ .env file not found")
        print("   Please copy .env.example to .env and configure your settings")
        sys.exit(1)
    
    success = validate_config()
    sys.exit(0 if success else 1)
