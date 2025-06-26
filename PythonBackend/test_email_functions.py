# test_email_functions.py
"""
Test script for the email functionality
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sendEmail import send_email, send_compliance_notification

def test_send_email():
    """Test the basic send_email function"""
    print("Testing send_email function...")
    
    result = send_email(
        subject="Test Email from Compliance System",
        content="This is a test email to verify the email functionality is working correctly.\n\nBest regards,\nCompliance Communications System",
        content_type="plain",
        sender_name="Test System"
    )
    
    print(f"Result: {result}")
    return result

def test_send_compliance_notification():
    """Test the compliance notification function"""
    print("\nTesting send_compliance_notification function...")
    
    result = send_compliance_notification(
        notification_type="policy_update",
        details="The data retention policy has been updated to require 7-year retention for financial records instead of 5 years. Please update your procedures accordingly.",
        priority="high"
    )
    
    print(f"Result: {result}")
    return result

if __name__ == "__main__":
    print("🧪 Testing Email Functions")
    print("=" * 50)
    
    # Test basic email function
    email_result = test_send_email()
    
    # Test compliance notification
    notification_result = test_send_compliance_notification()
    
    print("\n" + "=" * 50)
    print("📧 Email Function Tests Complete")
    
    if email_result["success"] and notification_result["success"]:
        print("✅ All tests passed!")
    else:
        print("❌ Some tests failed!")
        
    print("\nNote: Emails are in simulation mode by default.")
    print("To actually send emails, set EMAIL_MODE=production in your .env file")
    print("and configure SMTP settings.")
