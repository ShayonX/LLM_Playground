# sendEmail.py
import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
import os
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

# Configure logging
logger = logging.getLogger(__name__)

def send_email(
    subject: str,
    content: str,
    content_type: str = "plain",
    sender_name: str = "Compliance Communications System"
) -> dict:
    """
    Send an email to shayon.gupta@microsoft.com with the specified content
    
    Args:
        subject (str): The email subject line
        content (str): The email content/body
        content_type (str): The content type - "plain" or "html" (default: "plain")
        sender_name (str): The name to display as sender (default: "Compliance Communications System")
    
    Returns:
        dict: Success status and message details
    """
    try:
        # Email configuration
        recipient_email = "shayon.gupta@microsoft.com"
        sender_email = os.getenv("SMTP_SENDER_EMAIL", "noreply@compliancecomms.com")
        sender_password = os.getenv("SMTP_SENDER_PASSWORD", "")
        smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        smtp_port = int(os.getenv("SMTP_PORT", "587"))
        
        # Create message
        message = MIMEMultipart("alternative")
        message["Subject"] = subject
        message["From"] = f"{sender_name} <{sender_email}>"
        message["To"] = recipient_email
        
        # Create the email content
        if content_type.lower() == "html":
            email_part = MIMEText(content, "html")
        else:
            email_part = MIMEText(content, "plain")
        
        message.attach(email_part)
        
        # For development/testing - log the email instead of actually sending it
        # This prevents accidental spam and allows testing without SMTP setup
        if os.getenv("EMAIL_MODE", "test").lower() == "test":
            logger.info("EMAIL SIMULATION MODE - Email would be sent:")
            logger.info(f"To: {recipient_email}")
            logger.info(f"From: {sender_name} <{sender_email}>")
            logger.info(f"Subject: {subject}")
            logger.info(f"Content Type: {content_type}")
            logger.info(f"Content: {content}")
            
            return {
                "success": True,
                "message": "Email simulated successfully (test mode)",
                "recipient": recipient_email,
                "subject": subject,
                "content_preview": content[:100] + "..." if len(content) > 100 else content,
                "mode": "simulation"
            }
        
        # Production mode - actually send the email
        else:
            # Create secure connection and send email
            context = ssl.create_default_context()
            
            with smtplib.SMTP(smtp_server, smtp_port) as server:
                server.starttls(context=context)
                if sender_password:
                    server.login(sender_email, sender_password)
                
                text = message.as_string()
                server.sendmail(sender_email, recipient_email, text)
            
            logger.info(f"Email sent successfully to {recipient_email}")
            
            return {
                "success": True,
                "message": "Email sent successfully",
                "recipient": recipient_email,
                "subject": subject,
                "content_preview": content[:100] + "..." if len(content) > 100 else content,
                "mode": "production"
            }
    
    except Exception as e:
        error_msg = f"Failed to send email: {str(e)}"
        logger.error(error_msg)
        
        return {
            "success": False,
            "message": error_msg,
            "recipient": "shayon.gupta@microsoft.com",
            "subject": subject,
            "error": str(e)
        }

def send_compliance_notification(
    notification_type: str,
    details: str,
    priority: str = "normal"
) -> dict:
    """
    Send a compliance-specific notification email with predefined formatting
    
    Args:
        notification_type (str): Type of notification (e.g., "policy_update", "training_due", "audit_alert")
        details (str): Specific details about the notification
        priority (str): Priority level - "low", "normal", "high", "urgent" (default: "normal")
    
    Returns:
        dict: Success status and message details
    """
    # Map notification types to subjects and templates
    notification_templates = {
        "policy_update": {
            "subject": "🔄 Compliance Policy Update Notification",
            "template": """
Dear Shayon,

A compliance policy has been updated that requires your attention.

Policy Update Details:
{details}

Please review the updated policy and ensure your team is aware of any changes.

Best regards,
Compliance Communications System
            """.strip()
        },
        "training_due": {
            "subject": "📚 Compliance Training Due Notification",
            "template": """
Dear Shayon,

This is a reminder about upcoming compliance training requirements.

Training Details:
{details}

Please ensure completion by the specified deadline to maintain compliance status.

Best regards,
Compliance Communications System
            """.strip()
        },
        "audit_alert": {
            "subject": "🔍 Audit Alert Notification",
            "template": """
Dear Shayon,

An audit-related item requires your immediate attention.

Audit Details:
{details}

Please review and take appropriate action as soon as possible.

Best regards,
Compliance Communications System
            """.strip()
        },
        "general": {
            "subject": "ℹ️ Compliance Notification",
            "template": """
Dear Shayon,

A compliance-related notification has been generated.

Details:
{details}

Please review and take any necessary action.

Best regards,
Compliance Communications System
            """.strip()
        }
    }
    
    # Get the template or default to general
    template_info = notification_templates.get(notification_type, notification_templates["general"])
    
    # Add priority indicator to subject if high or urgent
    subject = template_info["subject"]
    if priority.lower() == "high":
        subject = f"🟡 HIGH PRIORITY - {subject}"
    elif priority.lower() == "urgent":
        subject = f"🔴 URGENT - {subject}"
    
    # Format the email content
    content = template_info["template"].format(details=details)
    
    # Send the email
    return send_email(
        subject=subject,
        content=content,
        content_type="plain",
        sender_name="Compliance Communications System"
    )
