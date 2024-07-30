import firebase_admin
from firebase_admin import messaging
from firebase_admin import credentials
from app.firebase import get_firebase_app
from app.email_utils import send_email
from app.sms import send_sms

firebase_app = get_firebase_app()

def sanitize_fcm_data(data):
    """
    Sanitize data for FCM:
    - Convert all values to strings
    - Remove any key-value pairs where the value is None
    """
    return {k: str(v) for k, v in data.items() if v is not None}

async def send_notification(flight_status):
    # Prepare Firebase notification data
    firebase_data = sanitize_fcm_data({
        "flight_id": flight_status.flight_id,
        "status": flight_status.status,
        "gate": flight_status.gate,
        "delay": flight_status.delay,
    })

    # Debug logging
    print("Sanitized Firebase data:", firebase_data)

    # Firebase notification
    message = messaging.Message(
        data=firebase_data,
        topic=str(flight_status.flight_id),
        notification=messaging.Notification(
            title=f"Flight {flight_status.flight_id} Update",
            body=f"Status: {flight_status.status}, Gate: {flight_status.gate or 'Not Assigned'}, Delay: {flight_status.delay or 'No Delay'}"
        )
    )

    try:
        response = messaging.send(message, app=firebase_app)
        print("Successfully sent Firebase message:", response)
    except Exception as e:
        print("Failed to send Firebase notification:", str(e))
        print("Firebase message data:", message.data)

    # Email notification
    subject = f"Flight {flight_status.flight_id} Status Update"
    body = f"""
    Flight Status Update:
    Flight ID: {flight_status.flight_id}
    Status: {flight_status.status}
    Gate: {flight_status.gate if flight_status.gate else 'Not Assigned'}
    Delay: {flight_status.delay if flight_status.delay is not None else 'No Delay'}
    """
    recipient = "shubhsardana31.ss@gmail.com"  # replace with flight booked user's email
    try:
        send_email(subject, recipient, body)
        print(f"Email sent successfully to {recipient}")
    except Exception as e:
        print(f"Failed to send email to {recipient}: {str(e)}")

    # SMS notification
    sms_body = f"Flight {flight_status.flight_id} Update: {flight_status.status}, Gate: {flight_status.gate if flight_status.gate else 'Not Assigned'}, Delay: {flight_status.delay if flight_status.delay is not None else 'No Delay'}"
    sms_recipient = "+919818518409"
    try:
        send_sms(sms_recipient, sms_body)
        print(f"SMS sent successfully to {sms_recipient}")
    except Exception as e:
        print(f"Failed to send SMS to {sms_recipient}: {str(e)}")

    # Return a summary of notifications sent
    return {
        "firebase": "Sent successfully" if "response" in locals() else "Failed",
        "email": "Sent successfully",
        "sms": "Sent successfully"
    }
