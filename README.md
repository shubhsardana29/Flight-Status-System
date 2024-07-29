# Flight Status and Notifications System

## Hack to Hire 2024 - Full Stack Developer Case Study

![hack-to-hire](https://github.com/user-attachments/assets/d27d6198-511c-44a0-b239-1172eaa1d79f)


## Table of Contents
1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Backend Setup](#backend-setup)
   - [Frontend Setup](#frontend-setup)
5. [Usage](#usage)
6. [System Design](#system-design)
7. [Screenshots](#screenshots)
8. [Video Demo](#video-demo)
9. [Future Enhancements](#future-enhancements)

## Project Overview

This Flight Status and Notifications System was developed as part of the Hack to Hire 2024 challenge. It provides real-time flight status updates and multi-channel notifications to passengers, ensuring they stay informed about any changes to their flights.

### Case Study Briefing

In response to the challenge, I developed a comprehensive system that seamlessly integrates real-time updates with multi-channel notifications. The solution features a responsive React frontend, a robust Python FastAPI backend, and utilizes various technologies for efficient data management and communication.

Key aspects of the implementation include:
- Real-time updates using WebSocket connections
- Multi-channel notifications (push, email, SMS)
- Integration with mock airport data systems
- User authentication for personalized flight tracking
- Accessibility features including speech synthesis

The system successfully addresses the challenge by providing a robust, real-time flight status tracking solution that keeps passengers informed promptly and efficiently.

## Features

- Real-time flight status board with filtering and search capabilities
- Individual flight detail pages with live updates
- Multi-channel notifications:
  - Push notifications via Firebase Cloud Messaging
  - Email notifications
  - SMS notifications
- User authentication and personalized flight tracking
- WebSocket integration for instant updates
- Speech synthesis for audible announcements
- Responsive design for various device sizes

## Tech Stack

### Frontend
- React.js with Vite
- Tailwind CSS for styling
- Framer Motion for animations
- Axios for API requests
- React Router for navigation

### Backend
- Python with FastAPI
- WebSocket for real-time communications
- JWT for authentication

### Database
- MongoDB

### Notifications
- Firebase Cloud Messaging for push notifications
- SMTP for email notifications
- Twilio for SMS notifications

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- Python 3.8+
- MongoDB
- Firebase account
- Twilio account
- SMTP server access (e.g., Gmail)

### Backend Setup
The backend of this project is built with Python using FastAPI. Follow these steps to set up and run the backend:


1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create and activate a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   Create a `.env` file in the backend directory with the following:
   ```
   MONGO_CONNECTION_STRING=your_mongodb_connection_string
   SMTP_SERVER=your_smtp_server
   SMTP_PORT=your_smtp_port
   SMTP_USERNAME=your_email
   SMTP_PASSWORD=your_email_password
   TWILIO_ACCOUNT_SID=your_twilio_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_phone_number
   ```
    #### Here's how to obtain each of these credentials:

    1. **MONGO_CONNECTION_STRING**:

    - Sign up for a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
    - Create a new cluster
    - Click "Connect" on your cluster, then "Connect your application"
    - Copy the connection string, replacing `<password>` with your database user's password

    2. **SMTP_SERVER, SMTP_PORT, SMTP_USERNAME, SMTP_PASSWORD** (for Gmail):

    - SMTP_SERVER: Use `smtp.gmail.com`
    - SMTP_PORT: Use `587`
    - SMTP_USERNAME: Your full Gmail address
    - SMTP_PASSWORD: 
        - Go to your [Google Account](https://myaccount.google.com/)
        - Select "Security" > "2-Step Verification" > "App passwords"
        - Select "Mail" and "Other (Custom name)"
        - Use the generated 16-character password

    3. **TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER**:

    - Sign up for a free account at [Twilio](https://www.twilio.com/)
    - Find your Account SID and Auth Token on the [Twilio Console Dashboard](https://www.twilio.com/console)
    - To get a Twilio phone number:
        - Go to [Phone Numbers](https://www.twilio.com/console/phone-numbers/incoming) in your Twilio account
        - Click "Get your first Twilio phone number"
        - Select a number and use it for TWILIO_PHONE_NUMBER

    ### Firebase Setup (for Cloud Messaging)

    1. Go to the [Firebase Console](https://console.firebase.google.com/)
    2. Create a new project or select an existing one
    3. Go to Project settings > Service Accounts
    4. Click "Generate new private key"
    5. Rename the downloaded file to `serviceAccountKey.json` 


5. Set up Firebase:
   Place your `serviceAccountKey.json` file in the backend directory.

6. Insert dummy flight data into MongoDB:
   ```
   python script.py
   ```

7. Run the FastAPI server:
   ```
   python -m app.main
   ```
The server should now be running on `http://localhost:8000`.

### Frontend Setup

The frontend of this project is built with React using Vite as the build tool. Follow these steps to set up and run the frontend:

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

    ### Firebase Setup for Frontend

    The frontend uses Firebase for cloud messaging. Follow these steps to set up your own Firebase configuration:

    1. Go to the [Firebase Console](https://console.firebase.google.com/).
    2. Click on "Add project" or select an existing project.
    3. Once your project is set up, click on the web icon (</>) to add a web app to your project.
    4. Register your app with a nickname (e.g., "Flight Status Frontend").
    5. Firebase will provide you with a configuration object. It will look similar to this:

    ```javascript
    const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
    };
    ```

    6. Create a file named `firebase-config.js` in your `src` directory if it doesn't exist already.
    7. Replace the content of `firebase-config.js` with the following, using your own configuration:

    ```javascript
    import { initializeApp } from "firebase/app";
    import { getMessaging, getToken, onMessage } from "firebase/messaging";

    const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
    };

    const app = initializeApp(firebaseConfig);
    const messaging = getMessaging(app);

    export { messaging, getToken, onMessage };
    ```

<!-- 8. In the Firebase Console, go to Project settings > Cloud Messaging.
9. In the "Web configuration" section, click "Generate key pair" to create a VAPID key.
10. Copy the generated key and store it securely. You'll need this for registering service workers in your application. -->
  

4. Run the development server:
   ```
   npm run dev
   ```

## Usage

After setting up both backend and frontend, you can access the application at `http://localhost:5173`. Register an account, log in, and start tracking flights. You'll receive real-time updates and notifications for any changes to flight statuses.

## System Design

<img width="1440" alt="Screenshot 2024-07-29 at 10 45 27 PM" src="https://github.com/user-attachments/assets/0e766d02-00d8-4f85-b451-46fa480486b3">



## Screenshots

![All Flights Status](https://github.com/user-attachments/assets/b0cdb3dc-50d9-474e-a965-d7775299da9b)


![update/Add Flight Status](https://github.com/user-attachments/assets/aca0d8e7-74e3-4bad-ae95-320b1bb75daf)



![Check Flight Status](https://github.com/user-attachments/assets/c76b586a-c31e-4465-a70c-6aa8117ad098)

## Video Demo

[Link to Video Demo](https://youtu.be/your_video_id)

## Future Enhancements

- Integration with real airport systems
<!-- - Advanced analytics for flight delay predictions -->

