#!/usr/bin/env python3
"""
Quick Start Setup Script for BYOM Configuration

This script guides you through setting up your .env file for the BYOM scenario.
"""

import os
import shutil

def setup_env_file():
    """Guide user through .env setup"""
    print("🚀 BYOM Quick Start Setup")
    print("=" * 50)
    
    # Check if .env already exists
    if os.path.exists(".env"):
        print("⚠️  .env file already exists")
        overwrite = input("Do you want to overwrite it? (y/N): ").lower().strip()
        if overwrite != 'y':
            print("Setup cancelled.")
            return
    
    # Copy .env.example to .env
    if os.path.exists(".env.example"):
        shutil.copy(".env.example", ".env")
        print("✅ Created .env file from .env.example")
    else:
        print("❌ .env.example file not found")
        return
    
    print("\n📝 Next Steps:")
    print("1. Edit the .env file with your Azure OpenAI details:")
    print("   - AZURE_OPENAI_ENDPOINT (your Azure OpenAI resource URL)")
    print("   - AZURE_OPENAI_DEPLOYMENT_NAME (your model deployment name)")
    print("")
    print("2. Authenticate with Azure:")
    print("   az login")
    print("")
    print("3. Validate your setup:")
    print("   python validate_config.py")
    print("")
    print("4. Start the application:")
    print("   python -m uvicorn main:app --reload --port 8001")
    print("")
    print("📚 For detailed instructions, see README.md")
    
    # Optionally open the .env file
    try:
        import subprocess
        import sys
        
        if sys.platform == "win32":
            os.startfile(".env")
        elif sys.platform == "darwin":  # macOS
            subprocess.call(["open", ".env"])
        else:  # Linux
            subprocess.call(["xdg-open", ".env"])
        
        print("📝 Opened .env file for editing")
    except:
        print("💡 Please manually edit the .env file")

if __name__ == "__main__":
    setup_env_file()
