# test_api_email_integration.py
"""
Test the email functionality through the FastAPI endpoints
"""
import requests
import json

def test_email_via_chat_api():
    """Test email functionality through the chat API"""
    
    url = "http://localhost:8002/chat"
    
    # Test sending a basic email
    request_data = {
        "message": "Please send an email to Shayon with the subject 'Test Email from API' and content 'This is a test email sent through the API to verify the email functionality is working correctly.'",
        "scenario": "default",
        "messages": []
    }
    
    print("🧪 Testing email functionality through chat API...")
    print(f"Request: {request_data['message']}")
    
    try:
        response = requests.post(url, json=request_data, timeout=30)
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Response: {result['response']}")
            return True
        else:
            print(f"❌ HTTP Error {response.status_code}: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Request failed: {str(e)}")
        return False

def test_compliance_notification_via_chat_api():
    """Test compliance notification through the chat API"""
    
    url = "http://localhost:8002/chat"
    
    # Test sending a compliance notification
    request_data = {
        "message": "Please send a compliance notification to Shayon about a policy update. The notification type should be 'policy_update' with high priority. The details are: 'New data retention policy requires all financial records to be kept for 7 years instead of 5 years. Please update your procedures by December 31st.'",
        "scenario": "default",
        "messages": []
    }
    
    print("\n🧪 Testing compliance notification through chat API...")
    print(f"Request: {request_data['message']}")
    
    try:
        response = requests.post(url, json=request_data, timeout=30)
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Response: {result['response']}")
            return True
        else:
            print(f"❌ HTTP Error {response.status_code}: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Request failed: {str(e)}")
        return False

if __name__ == "__main__":
    print("🧪 Testing Email Integration with API")
    print("=" * 60)
    
    # Test basic email functionality
    email_test_passed = test_email_via_chat_api()
    
    # Test compliance notification
    notification_test_passed = test_compliance_notification_via_chat_api()
    
    print("\n" + "=" * 60)
    print("📧 API Email Integration Tests Complete")
    
    if email_test_passed and notification_test_passed:
        print("✅ All tests passed!")
    else:
        print("❌ Some tests failed!")
        
    print("\nNote: Make sure the FastAPI server is running on http://localhost:8002")
