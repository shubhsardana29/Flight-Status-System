import os
from twilio.rest import Client
from dotenv import load_dotenv

load_dotenv()

TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER")

client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

def send_sms(to: str, body: str):
    try:
        message = client.messages.create(
            body=body,
            from_=TWILIO_PHONE_NUMBER,
            to=to
        )
        print(f"SMS sent successfully to {to}: {message.sid}")
    except Exception as e:
        print(f"Failed to send SMS to {to}: {e}")
