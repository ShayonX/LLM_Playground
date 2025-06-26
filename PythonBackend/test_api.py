"""
Simple test script to verify the FastAPI backend is working
"""
import requests
import json

def test_health_endpoint():
    """Test the health endpoint"""
    try:
        response = requests.get("http://localhost:8001/health")
        print(f"Health Check Status: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Health check failed: {e}")
        return False

def test_chat_endpoint():
    """Test the chat endpoint"""
    try:
        payload = {
            "message": "Hello, can you help me with compliance communications?",
            "scenario": "default",
            "messages": []
        }        
        response = requests.post(
            "http://localhost:8001/chat",
            headers={"Content-Type": "application/json"},
            json=payload
        )
        
        print(f"Chat Endpoint Status: {response.status_code}")
        result = response.json()
        print(f"Response: {json.dumps(result, indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"Chat test failed: {e}")
        return False

def main():
    print("Testing Python FastAPI Backend...")
    print("=" * 50)
    
    # Test health endpoint
    print("1. Testing Health Endpoint...")
    health_ok = test_health_endpoint()
    print()
    
    # Test chat endpoint (only if OpenAI is configured)
    print("2. Testing Chat Endpoint...")
    chat_ok = test_chat_endpoint()
    print()
    
    # Summary
    print("=" * 50)
    print("Test Results:")
    print(f"Health Endpoint: {'✓ PASS' if health_ok else '✗ FAIL'}")
    print(f"Chat Endpoint: {'✓ PASS' if chat_ok else '✗ FAIL'}")
    
    if health_ok and chat_ok:
        print("\n🎉 All tests passed! Backend is ready for frontend integration.")
    elif health_ok:
        print("\n⚠️  Backend is running but OpenAI may not be configured.")
        print("   Check your .env file and add your OpenAI API key.")
    else:
        print("\n❌ Backend is not responding. Make sure it's running on port 8001.")

if __name__ == "__main__":
    main()
