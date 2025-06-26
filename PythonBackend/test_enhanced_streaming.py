#!/usr/bin/env python3
"""
Enhanced test script to verify all streaming event types are handled correctly
Tests the new event types:
- response.created
- response.in_progress  
- response.output_item.added
- response.output_item.done
- response.function_call_arguments.delta
- response.function_call_arguments.done
- response.completed
"""

import asyncio
import aiohttp
import json
import time
from typing import Dict, List, Set

# API base URL
BASE_URL = "http://localhost:8001"

class StreamEventTracker:
    """Track and analyze streaming events"""
    
    def __init__(self):
        self.events: List[Dict] = []
        self.event_types: Set[str] = set()
        self.function_calls: List[Dict] = []
        self.function_args_deltas: Dict[str, List[str]] = {}
        self.reasoning_content = ""
        self.response_content = ""
        
    def track_event(self, event_data: Dict):
        """Track a streaming event"""
        self.events.append({
            'timestamp': time.time(),
            'data': event_data
        })
        
        event_type = event_data.get('type', 'unknown')
        self.event_types.add(event_type)
        
        # Track specific event types
        if event_type == 'function_call':
            self.function_calls.append(event_data)
        elif event_type == 'function_args_delta':
            call_id = event_data.get('call_id', 'unknown')
            if call_id not in self.function_args_deltas:
                self.function_args_deltas[call_id] = []
            self.function_args_deltas[call_id].append(event_data.get('delta', ''))
        elif event_type == 'reasoning':
            self.reasoning_content += event_data.get('content', '')
        elif event_type == 'content':
            self.response_content += event_data.get('content', '')
    
    def print_summary(self):
        """Print summary of tracked events"""
        print("\n" + "="*80)
        print("STREAMING EVENT ANALYSIS SUMMARY")
        print("="*80)
        
        print(f"📊 Total Events: {len(self.events)}")
        print(f"🎯 Unique Event Types: {len(self.event_types)}")
        print(f"🔧 Function Calls: {len(self.function_calls)}")
        print(f"📝 Reasoning Length: {len(self.reasoning_content)} chars")
        print(f"💬 Response Length: {len(self.response_content)} chars")
        
        print(f"\n📋 Event Types Encountered:")
        for event_type in sorted(self.event_types):
            count = sum(1 for e in self.events if e['data'].get('type') == event_type)
            print(f"  • {event_type}: {count} occurrences")
        
        # Check for new event types
        expected_new_events = {
            'stream_created', 'stream_progress', 'output_item_added', 
            'output_item_done', 'function_args_delta', 'function_args_complete',
            'stream_completed'
        }
        found_new_events = self.event_types.intersection(expected_new_events)
        
        print(f"\n✅ New Event Types Detected:")
        if found_new_events:
            for event_type in sorted(found_new_events):
                print(f"  • {event_type}")
        else:
            print("  • None detected")
        
        # Function argument streaming analysis
        if self.function_args_deltas:
            print(f"\n🔄 Function Arguments Streaming:")
            for call_id, deltas in self.function_args_deltas.items():
                reconstructed = ''.join(deltas)
                print(f"  • Call {call_id}: {len(deltas)} deltas -> '{reconstructed[:100]}{'...' if len(reconstructed) > 100 else ''}'")

async def test_enhanced_chat_stream():
    """Test the enhanced /api/chat/stream endpoint"""
    print("🧪 Testing Enhanced Chat Stream Endpoint...")
    
    tracker = StreamEventTracker()
    
    payload = {
        "message": "Can you help me analyze the current compliance posture and get some financial data? Please use functions to get real data.",
        "scenario": "compliance_review",
        "reasoning": {
            "effort": "high",
            "summary": "detailed"
        }
    }
    
    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{BASE_URL}/api/chat/stream",
                json=payload,
                headers={"Content-Type": "application/json"}
            ) as response:
                if response.status == 200:
                    print("✅ Stream Started Successfully")
                    
                    async for line in response.content:
                        line = line.decode('utf-8').strip()
                        if line.startswith('data: '):
                            data_str = line[6:]
                            try:
                                event_data = json.loads(data_str)
                                tracker.track_event(event_data)
                                
                                # Print key events in real-time
                                event_type = event_data.get('type')
                                if event_type in ['stream_created', 'stream_progress', 'stream_completed']:
                                    print(f"🔄 {event_type}: {event_data.get('message', '')}")
                                elif event_type == 'function_args_delta':
                                    print(f"📤 Function args delta: {event_data.get('function')} - {event_data.get('delta', '')[:50]}")
                                elif event_type == 'function_args_complete':
                                    print(f"✅ Function args complete: {event_data.get('function')}")
                                elif event_type == 'done':
                                    print("🎉 Stream Complete!")
                                    break
                                    
                            except json.JSONDecodeError:
                                continue
                                
                    tracker.print_summary()
                else:
                    print(f"❌ HTTP Error: {response.status}")
                    
    except Exception as e:
        print(f"❌ Error during chat stream test: {e}")

async def test_enhanced_cot_stream():
    """Test the enhanced /chat/cot-stream endpoint"""
    print("\n🧪 Testing Enhanced CoT Stream Endpoint...")
    
    tracker = StreamEventTracker()
    
    payload = {
        "message": "Explain the relationship between data governance and regulatory compliance, and provide specific examples from financial services.",
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
                    print("✅ CoT Stream Started Successfully")
                    
                    async for line in response.content:
                        line = line.decode('utf-8').strip()
                        if line.startswith('data: '):
                            data_str = line[6:]
                            try:
                                event_data = json.loads(data_str)
                                tracker.track_event(event_data)
                                
                                # Print key events in real-time
                                event_type = event_data.get('type')
                                if event_type in ['stream_created', 'reasoning_start', 'content_start', 'stream_completed']:
                                    print(f"🧠 {event_type}: {event_data.get('message', 'CoT milestone')}")
                                elif event_type == 'done':
                                    print("🎉 CoT Stream Complete!")
                                    break
                                    
                            except json.JSONDecodeError:
                                continue
                                
                    tracker.print_summary()
                else:
                    print(f"❌ HTTP Error: {response.status}")
                    
    except Exception as e:
        print(f"❌ Error during CoT stream test: {e}")

async def test_enhanced_upload_stream():
    """Test the enhanced /chat/upload-cot-stream endpoint"""
    print("\n🧪 Testing Enhanced Upload Stream Endpoint...")
    
    tracker = StreamEventTracker()
    
    # Create a simple test PDF
    test_pdf_content = b"""%PDF-1.4
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >> endobj
4 0 obj << /Length 44 >> stream
BT /F1 12 Tf 100 700 Td (Test Compliance Document) Tj ET
endstream endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000206 00000 n 
trailer << /Size 5 /Root 1 0 R >>
startxref
293
%%EOF"""
    
    try:
        data = aiohttp.FormData()
        data.add_field('file', test_pdf_content, filename='test_compliance.pdf', content_type='application/pdf')
        data.add_field('message', 'Please analyze this compliance document and extract key requirements.')
        data.add_field('scenario', 'compliance_review')
        data.add_field('messages', '[]')
        data.add_field('reasoning_effort', 'high')
        data.add_field('reasoning_summary', 'detailed')
        
        async with aiohttp.ClientSession() as session:
            async with session.post(f"{BASE_URL}/chat/upload-cot-stream", data=data) as response:
                if response.status == 200:
                    print("✅ Upload Stream Started Successfully")
                    
                    async for line in response.content:
                        line = line.decode('utf-8').strip()
                        if line.startswith('data: '):
                            data_str = line[6:]
                            try:
                                event_data = json.loads(data_str)
                                tracker.track_event(event_data)
                                
                                # Print key events in real-time
                                event_type = event_data.get('type')
                                if event_type == 'file_processed':
                                    print(f"📄 File processed: {event_data.get('filename')}")
                                elif event_type in ['stream_created', 'stream_completed']:
                                    print(f"📤 {event_type}: {event_data.get('message', '')}")
                                elif event_type == 'done':
                                    print("🎉 Upload Stream Complete!")
                                    break
                                    
                            except json.JSONDecodeError:
                                continue
                                
                    tracker.print_summary()
                else:
                    print(f"❌ HTTP Error: {response.status}")
                    
    except Exception as e:
        print(f"❌ Error during upload stream test: {e}")

def check_server_availability():
    """Check if the server is running"""
    import requests
    try:
        response = requests.get(f"{BASE_URL}/api/cot/info", timeout=5)
        return response.status_code == 200
    except:
        return False

async def main():
    """Run all enhanced streaming tests"""
    print("🚀 Enhanced Streaming Event Type Tests")
    print("="*80)
    
    if not check_server_availability():
        print("❌ Backend server not available. Please start it on localhost:8001")
        return
    
    print("✅ Backend server is running")
    
    # Run all tests
    await test_enhanced_chat_stream()
    await test_enhanced_cot_stream()
    await test_enhanced_upload_stream()
    
    print("\n🎯 All enhanced streaming tests completed!")
    print("="*80)

if __name__ == "__main__":
    asyncio.run(main())
