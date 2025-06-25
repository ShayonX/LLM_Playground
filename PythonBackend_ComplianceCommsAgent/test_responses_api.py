#!/usr/bin/env python3
"""
Test script for the updated Responses API integration
"""

import requests
import json
import time

# Test configuration
BASE_URL = "http://localhost:8001"

def test_health_check():
    """Test the health check endpoint"""
    print("Testing health check...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"Health check status: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Health check failed: {e}")
        return False

def test_basic_chat():
    """Test basic chat completion"""
    print("\nTesting basic chat completion...")
    try:
        payload = {
            "message": "What is compliance management?",
            "scenario": "default",
            "messages": []
        }
        response = requests.post(f"{BASE_URL}/chat", json=payload)
        print(f"Chat status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"Response received: {result['success']}")
            print(f"Response preview: {result['response'][:100]}...")
        else:
            print(f"Error: {response.text}")
        return response.status_code == 200
    except Exception as e:
        print(f"Chat test failed: {e}")
        return False

def test_chained_chat():
    """Test chained chat completion"""
    print("\nTesting chained chat completion...")
    try:
        payload = {
            "initial_message": "Explain data privacy regulations",
            "follow_up_message": "How does this apply to small businesses?",
            "scenario": "policy_review"
        }
        response = requests.post(f"{BASE_URL}/api/chat/chained", json=payload)
        print(f"Chained chat status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"First response ID: {result.get('first_response_id', 'N/A')}")
            print(f"Second response ID: {result.get('second_response_id', 'N/A')}")
            print(f"Success: {result['success']}")
        else:
            print(f"Error: {response.text}")
        return response.status_code == 200
    except Exception as e:
        print(f"Chained chat test failed: {e}")
        return False

def test_function_calling():
    """Test function calling chat"""
    print("\nTesting function calling...")
    try:
        payload = {
            "message": "Check if our privacy policy complies with GDPR",
            "scenario": "default",
            "messages": []
        }
        response = requests.post(f"{BASE_URL}/api/chat/function-calling", json=payload)
        print(f"Function calling status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"Function calls made: {len(result.get('function_calls', []))}")
            print(f"Response ID: {result.get('response_id', 'N/A')}")
            print(f"Success: {result['success']}")
        else:
            print(f"Error: {response.text}")
        return response.status_code == 200
    except Exception as e:
        print(f"Function calling test failed: {e}")
        return False

def test_streaming_chat():
    """Test streaming chat"""
    print("\nTesting streaming chat...")
    try:
        payload = {
            "message": "Explain the key principles of effective compliance training",
            "scenario": "training_materials",
            "messages": []
        }
        response = requests.post(f"{BASE_URL}/api/chat/stream", json=payload, stream=True)
        print(f"Streaming chat status: {response.status_code}")
        
        if response.status_code == 200:
            chunk_count = 0
            for line in response.iter_lines():
                if line:
                    line = line.decode('utf-8')
                    if line.startswith('data: '):
                        try:
                            data = json.loads(line[6:])
                            if 'content' in data:
                                chunk_count += 1
                            elif data.get('done'):
                                print(f"Streaming completed. Received {chunk_count} chunks.")
                                return True
                            elif 'error' in data:
                                print(f"Streaming error: {data['error']}")
                                return False
                        except json.JSONDecodeError:
                            continue
        else:
            print(f"Error: {response.text}")
        return False
    except Exception as e:
        print(f"Streaming test failed: {e}")
        return False

def main():
    """Run all tests"""
    print("=== Responses API Integration Tests ===")
    
    tests = [
        ("Health Check", test_health_check),
        ("Basic Chat", test_basic_chat),
        ("Chained Chat", test_chained_chat), 
        ("Function Calling", test_function_calling),
        ("Streaming Chat", test_streaming_chat)
    ]
    
    results = []
    for test_name, test_func in tests:
        result = test_func()
        results.append((test_name, result))
        time.sleep(1)  # Brief pause between tests
    
    print("\n=== Test Results ===")
    passed = 0
    for test_name, result in results:
        status = "PASS" if result else "FAIL"
        print(f"{test_name}: {status}")
        if result:
            passed += 1
    
    print(f"\nOverall: {passed}/{len(tests)} tests passed")

if __name__ == "__main__":
    main()
