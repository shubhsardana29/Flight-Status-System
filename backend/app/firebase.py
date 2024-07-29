import firebase_admin
from firebase_admin import credentials


def get_firebase_app():
    try:
        return firebase_admin.get_app()
    except ValueError:
        cred = credentials.Certificate("serviceAccountKey.json")
        return firebase_admin.initialize_app(cred)
        




