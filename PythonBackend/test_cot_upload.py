#!/usr/bin/env python3
"""
Simple test script to verify the CoT upload endpoint works correctly.
"""

import asyncio
import aiohttp
import json
import os

async def test_cot_upload_endpoint():
    """Test the /api/chat/upload-cot-stream endpoint"""
    print("Testing CoT upload endpoint...")
    
    # Create a simple test PDF content (just text for this demo)
    test_content = b"""%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
100 700 Td
(Test PDF Content) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000206 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
293
%%EOF"""
    
    url = "http://localhost:8001/api/chat/upload-cot-stream"
    
    # Prepare form data
    data = aiohttp.FormData()
    data.add_field('file', test_content, filename='test.pdf', content_type='application/pdf')
    data.add_field('message', 'Please analyze this test document and explain what it contains.')
    data.add_field('scenario', 'default')
    data.add_field('messages', '[]')
    data.add_field('reasoning_effort', 'high')
    data.add_field('reasoning_summary', 'detailed')
    
    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(url, data=data) as response:
                if response.status == 200:
                    print("✅ Endpoint responding successfully!")
                    print("📊 Streaming response events:")
                    
                    async for line in response.content:
                        line_str = line.decode('utf-8').strip()
                        if line_str.startswith('data: '):
                            data_str = line_str[6:]
                            if data_str.strip():
                                try:
                                    event_data = json.loads(data_str)
                                    event_type = event_data.get('type', 'unknown')
                                    
                                    if event_type == 'file_processed':
                                        print(f"📄 File processed: {event_data.get('filename')}")
                                    elif event_type == 'reasoning_start':
                                        print("🧠 Chain of Thought reasoning started...")
                                    elif event_type == 'reasoning':
                                        print("💭 Reasoning:", event_data.get('content', '')[:50] + "...")
                                    elif event_type == 'reasoning_end':
                                        print("✅ Reasoning completed")
                                    elif event_type == 'content_start':
                                        print("📝 Final response started...")
                                    elif event_type == 'content':
                                        print("📄 Content:", event_data.get('content', '')[:50] + "...")
                                    elif event_type == 'done':
                                        print("🎉 CoT upload stream completed successfully!")
                                        break
                                    elif event_type == 'error':
                                        print(f"❌ Error: {event_data.get('error')}")
                                        break
                                except json.JSONDecodeError:
                                    pass  # Skip malformed JSON
                else:
                    print(f"❌ HTTP Error: {response.status}")
                    error_text = await response.text()
                    print(f"Error details: {error_text}")
                    
    except aiohttp.ClientConnectorError:
        print("❌ Cannot connect to backend server. Make sure it's running on localhost:8001")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")

if __name__ == "__main__":
    asyncio.run(test_cot_upload_endpoint())
