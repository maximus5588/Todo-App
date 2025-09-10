# Todo-App

A minimal full-stack Todo application with user authentication using **Node.js**, **Express**, **PostgreSQL**, and **React**. Users can sign up, log in, and manage their to-do items.

---

## Features

- **User Authentication**
  - Sign up with username, email, and password
  - Log in with email and password
  - JWT-based authentication
  - Passwords are hashed using bcrypt

- **Todo Management**
  - Create, edit, delete to-do items
  - Mark items as pending or completed
  - View a list of your own todos

---

## Tech Stack

- **Frontend:** React
- **Backend:** Node.js, Express
- **Database:** PostgreSQL
- **Authentication:** JWT + bcrypt

---

## Setup Instructions

### Backend

1. Clone the repository:

   ```bash
   git clone <your-repo-url>
   cd backend

Install dependencies:

npm install


Create a .env file in the backend folder:

PORT=5000
DB_USER=postgres
DB_PASS=your_db_password
DB_HOST=localhost
DB_NAME=Todo
DB_PORT=5432
JWT_SECRET=change_this_to_a_strong_secret
JWT_EXPIRES_IN=7d


Start the backend server:

npm start


The backend will run on http://localhost:5000.

Frontend

Navigate to the frontend folder:

cd ../frontend


Install dependencies:

npm install


Start the frontend server:

npm start


The frontend will run on http://localhost:3000.

Usage

Open the app in your browser.

Sign up for a new account.

Log in with your credentials.

Add, edit, or delete todos as needed.

Logout when finished.