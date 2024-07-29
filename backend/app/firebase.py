import firebase_admin
import os
import json
from firebase_admin import credentials


def get_firebase_app():
    try:
        return firebase_admin.get_app()
    except ValueError:
        service_account_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS', 'serviceAccountKey.json')
        cred = credentials.Certificate(service_account_path)
        return firebase_admin.initialize_app(cred)
        




