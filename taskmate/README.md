# TaskMate – Student Task & Assignment Manager

A full-stack MERN (MongoDB, Express, React, Node.js) web application that lets
students register, log in, and manage their assignments with deadlines,
priorities, and a progress dashboard.

## Folder Structure

```
taskmate/
├── backend/       Node.js + Express API, MongoDB models, JWT auth
└── frontend/      React application (UI)
```

## Prerequisites

- Node.js (v18 or later recommended) — https://nodejs.org
- MongoDB — either installed locally, or a free MongoDB Atlas cluster
  (https://www.mongodb.com/atlas)
- A code editor such as VS Code

## 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and set:
- `MONGO_URI` – your MongoDB connection string
- `JWT_SECRET` – any long random string
- `PORT` – defaults to 5000

Start the backend:

```bash
npm run dev        # requires nodemon (installed as a devDependency)
# or
npm start
```

You should see:
```
MongoDB connected successfully
TaskMate backend server running on http://localhost:5000
```

## 2. Frontend Setup

Open a **second terminal**:

```bash
cd frontend
npm install
cp .env.example .env
npm start
```

This opens the app in your browser at `http://localhost:3000`.

## 3. Using the App

1. Go to `http://localhost:3000`
2. Click **Register** and create an account
3. You'll be redirected to the **Dashboard**
4. Click **Add Task** to create your first assignment
5. Visit **My Tasks** to search, filter, edit, complete, or delete tasks
6. Visit **Profile** to view/edit your account details
7. Click **Logout** when done

## Notes for Viva / Submission

- Passwords are hashed with bcrypt before being stored — the database never
  stores plain text passwords.
- Every task is linked to the user who created it (`userId` field), and the
  backend only ever returns tasks belonging to the logged-in user.
- JWT tokens are stored in the browser's `localStorage` and sent with every
  API request in the `Authorization: Bearer <token>` header.
- See `PROJECT_DOCUMENTATION.docx` for the full report: abstract, modules,
  database design, API documentation, testing, viva Q&A, and presentation
  scripts.
