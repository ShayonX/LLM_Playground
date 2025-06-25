#!/usr/bin/env python3
"""
Test script for Chain of Thought (CoT) streaming API
This script demonstrates how to interact with the CoT streaming endpoints
"""

import requests
import json
import asyncio
import aiohttp

# API base URL
BASE_URL = "http://localhost:8001"

def test_cot_info():
    """Test the CoT info endpoint"""
    print("Testing CoT Info Endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/api/cot/info")
        if response.status_code == 200:
            info = response.json()
            print("✅ CoT Info Retrieved Successfully:")
            print(json.dumps(info, indent=2))
        else:
            print(f"❌ Failed to get CoT info: {response.status_code}")
    except Exception as e:
        print(f"❌ Error: {e}")
    print("-" * 50)

async def test_cot_streaming():
    """Test the CoT streaming endpoint"""
    print("Testing CoT Streaming Endpoint...")
    
    # Test payload with CoT reasoning configuration
    payload = {
        "message": "Explain the importance of data privacy in financial compliance and provide a step-by-step process for implementing a data privacy program.",
        "scenario": "policy_review",
        "reasoning": {
            "effort": "high",
            "summary": "detailed"
        }
    }
    
    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{BASE_URL}/chat/cot-stream",
                json=payload,
                headers={"Content-Type": "application/json"}
            ) as response:
                if response.status == 200:
                    print("✅ CoT Streaming Started:")
                    print("=" * 60)
                    
                    reasoning_content = ""
                    response_content = ""
                    
                    async for line in response.content:
                        line = line.decode('utf-8').strip()
                        if line.startswith('data: '):
                            data_str = line[6:]  # Remove 'data: ' prefix
                            try:
                                data = json.loads(data_str)
                                
                                if data.get('type') == 'reasoning_config':
                                    print(f"🧠 Reasoning Config: Effort={data['effort']}, Summary={data['summary']}")
                                
                                elif data.get('type') == 'reasoning_start':
                                    print("\n🤔 REASONING:")
                                    print("-" * 40)
                                
                                elif data.get('type') == 'reasoning':
                                    content = data.get('content', '')
                                    reasoning_content += content
                                    print(content, end='', flush=True)
                                
                                elif data.get('type') == 'reasoning_end':
                                    print("\n" + "-" * 40)
                                
                                elif data.get('type') == 'content_start':
                                    print("\n💬 RESPONSE:")
                                    print("-" * 40)
                                
                                elif data.get('type') == 'content':
                                    content = data.get('content', '')
                                    response_content += content
                                    print(content, end='', flush=True)
                                
                                elif data.get('type') == 'content_end':
                                    print("\n" + "-" * 40)
                                
                                elif data.get('type') == 'function_call':
                                    print(f"\n🔧 Function Call: {data.get('function')} ({data.get('status')})")
                                
                                elif data.get('type') == 'done':
                                    print("\n✅ Stream Complete!")
                                    break
                                
                                elif data.get('type') == 'error':
                                    print(f"\n❌ Error: {data.get('error')}")
                                    break
                                    
                            except json.JSONDecodeError:
                                continue
                                
                    print("\n" + "=" * 60)
                    print(f"Total reasoning length: {len(reasoning_content)} characters")
                    print(f"Total response length: {len(response_content)} characters")
                else:
                    print(f"❌ Failed to start CoT streaming: {response.status}")
                    
    except Exception as e:
        print(f"❌ Error during streaming: {e}")

def test_regular_streaming():
    """Test the regular streaming endpoint with CoT enabled"""
    print("Testing Regular Streaming with CoT...")
    
    payload = {
        "message": "What are the key components of a compliance risk assessment?",
        "reasoning": {
            "effort": "medium",
            "summary": "concise"
        }
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/chat/stream",
            json=payload,
            headers={"Content-Type": "application/json"},
            stream=True
        )
        
        if response.status_code == 200:
            print("✅ Regular Streaming with CoT Started:")
            print("-" * 40)
            
            for line in response.iter_lines():
                if line:
                    line = line.decode('utf-8').strip()
                    if line.startswith('data: '):
                        data_str = line[6:]
                        try:
                            data = json.loads(data_str)
                            if data.get('type') == 'reasoning':
                                print(f"🧠 {data.get('content', '')}", end='', flush=True)
                            elif data.get('type') == 'content':
                                print(f"💬 {data.get('content', '')}", end='', flush=True)
                            elif data.get('type') == 'done':
                                print("\n✅ Stream Complete!")
                                break
                        except json.JSONDecodeError:
                            continue
        else:
            print(f"❌ Failed to start regular streaming: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

async def main():
    """Main test function"""
    print("🚀 Testing Chain of Thought (CoT) Streaming API")
    print("=" * 60)
    
    # Test info endpoint first
    test_cot_info()
    
    # Test CoT streaming
    await test_cot_streaming()
    
    print("\n" + "=" * 60)
    print("🎉 CoT Testing Complete!")
    print("\nTo use CoT in your frontend:")
    print("1. Send POST request to /chat/cot-stream")
    print("2. Include 'reasoning' config in request body")
    print("3. Handle 'reasoning' and 'content' event types")
    print("4. Display reasoning before final response")

if __name__ == "__main__":
    asyncio.run(main())
